import { registerBuiltin, getFilters } from './tpl-builtin';
import { registerLodash } from './tpl-lodash';

export interface Enginer {
  test: (tpl: string) => boolean;
  compile: (tpl: string, data: object, ...rest: Array<any>) => string;
}

const enginers: {
  [propName: string]: Enginer;
} = {};

export function registerTplEnginer(name: string, enginer: Enginer) {
  enginers[name] = enginer;
}

export function filter(
  tpl?: string,
  data: object = {},
  ...rest: Array<any>
): string {
  if (!tpl || typeof tpl !== 'string') {
    return '';
  }

  for (const k of Object.keys(enginers)) {
    const enginer = enginers[k];
    if (enginer.test(tpl)) {
      return enginer.compile(tpl, data, ...rest);
    }
  }

  return tpl;
}
// 缓存一下提升性能
const EVAL_CACHE: { [key: string]: Function } = {};

// 缓存一下提升性能
export const FUN_EVAL_CACHE = new WeakMap<any, { [js: string]: Function }>();

let customEvalExpressionFn: (expression: string, data?: any) => boolean;
export function setCustomEvalExpression(
  fn: (expression: string, data?: any) => boolean,
) {
  customEvalExpressionFn = fn;
}

// 几乎所有的 visibleOn requiredOn 都是通过这个方法判断出来结果，很粗暴也存在风险，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalExpression 来替换。
export function evalExpression(expression: string, data?: object): boolean {
  if (typeof customEvalExpressionFn === 'function') {
    return customEvalExpressionFn(expression, data);
  }

  if (!expression || typeof expression !== 'string') {
    return false;
  }

  /* jshint evil:true */
  try {
    let debug = false;
    const idx = expression.indexOf('debugger');
    if (~idx) {
      debug = true;
      expression = expression.replace(/debugger;?/, '');
    }

    let fn;
    if (expression in EVAL_CACHE) {
      fn = EVAL_CACHE[expression];
    } else {
      fn = new Function(
        'data',
        'utils',
        `with(data) {${debug ? 'debugger;' : ''}return !!(${expression});}`,
      );
      EVAL_CACHE[expression] = fn;
    }

    data = data || {};
    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(expression, e);
    return false;
  }
}

let customEvalJsFn: (expression: string, data?: any) => any;
export function setCustomEvalJs(fn: (expression: string, data?: any) => any) {
  customEvalJsFn = fn;
}

// 这个主要用在 formula 里面，用来动态的改变某个值。也很粗暴，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalJs 来替换。
export function evalJS(js: string, data: object): any {
  if (typeof customEvalJsFn === 'function') {
    return customEvalJsFn(js, data);
  }

  /* jshint evil:true */
  try {
    const fn = new Function(
      'data',
      'utils',
      `with(data) {${/^\s*return\b/.test(js) ? '' : 'return '}${js};}`,
    );
    data = data || {};
    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(js, e);
    return null;
  }
}
const defaultData = {};
export function createStr2Function(
  js: string,
  data: object = defaultData,
): any {
  try {
    let fun;
    const tempFunMap = FUN_EVAL_CACHE.get(data);
    if (tempFunMap && tempFunMap[js]) return tempFunMap[js];
    if (js.includes('function')) {
      fun = new Function(`return ${js}`)();
    } else {
      fun = new Function(js);
    }
    const funResult = fun.bind(data);
    if (tempFunMap) {
      FUN_EVAL_CACHE.set(data, { ...tempFunMap, [js]: funResult });
    } else {
      FUN_EVAL_CACHE.set(data, { [js]: funResult });
    }

    return funResult;
  } catch (e) {
    console.warn(js, e);
    return undefined;
  }
}

[registerBuiltin, registerLodash].forEach((fn) => {
  const info = fn();

  registerTplEnginer(info.name, {
    test: info.test,
    compile: info.compile,
  });
});
