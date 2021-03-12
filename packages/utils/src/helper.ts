/**
 * 代码来源于amis
 * https://github.com/baidu/amis
 */
import { isObject, isPlainObject } from 'lodash';
import qs from 'qs';
import { PlainObject } from './types';

// 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
export function createObject(
  superProps?: { [propName: string]: any },
  props?: { [propName: string]: any },
  properties?: any,
): object {
  if (superProps && Object.isFrozen(superProps)) {
    superProps = cloneObject(superProps);
  }

  const obj = superProps
    ? Object.create(superProps, {
        ...properties,
        __super: {
          value: superProps,
          writable: false,
          enumerable: false,
        },
      })
    : Object.create(Object.prototype, properties);

  props &&
    isObject(props) &&
    Object.keys(props).forEach((key) => (obj[key] = props[key]));

  return obj;
}

export function object2formData(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
  },
  fd: FormData = new FormData(),
): any {
  const fileObjects: any = [];
  const others: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value instanceof File) {
      fileObjects.push([key, value]);
    } else if (
      Array.isArray(value) &&
      value.length &&
      value[0] instanceof File
    ) {
      value.forEach((value) => fileObjects.push([`${key}[]`, value]));
    } else {
      others[key] = value;
    }
  });

  // 因为 key 的格式太多了，偷个懒，用 qs 来处理吧。
  qsstringify(others, options)
    .split('&')
    .forEach((item) => {
      const parts = item.split('=');
      // form-data/multipart 是不需要 encode 值的。
      parts[0] && fd.append(parts[0], decodeURIComponent(parts[1]));
    });

  // Note: File类型字段放在后面，可以支持第三方云存储鉴权
  fileObjects.forEach((fileObject: any[]) =>
    fd.append(fileObject[0], fileObject[1], fileObject[1].name),
  );

  return fd;
}

// 只判断一层, 如果层级很深，form-data 也不好表达。
export function hasFile(object: any): boolean {
  return Object.keys(object).some((key) => {
    const value = object[key];

    return (
      value instanceof File ||
      (Array.isArray(value) && value.length && value[0] instanceof File)
    );
  });
}
export function rmUndefined(obj: PlainObject) {
  const newObj: PlainObject = {};

  if (typeof obj !== 'object') {
    return obj;
  }

  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}
export function isObjectShallowModified(
  prev: any,
  next: any,
  strictMode = true,
  ignoreUndefined = false,
): boolean {
  if (Array.isArray(prev) && Array.isArray(next)) {
    return prev.length !== next.length
      ? true
      : prev.some((prev, index) =>
          isObjectShallowModified(
            prev,
            next[index],
            strictMode,
            ignoreUndefined,
          ),
        );
  } else if (
    null == prev ||
    null == next ||
    !isObject(prev) ||
    !isObject(next)
  ) {
    return strictMode ? prev !== next : prev != next;
  }

  if (ignoreUndefined) {
    prev = rmUndefined(prev);
    next = rmUndefined(next);
  }

  const keys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (
    keys.length !== nextKeys.length ||
    keys.sort().join(',') !== nextKeys.sort().join(',')
  ) {
    return true;
  }
  for (let i: number = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    if (
      strictMode
        ? next[key] !== prev[key]
        : isObjectShallowModified(next[key], prev[key], false, ignoreUndefined)
    ) {
      return true;
    }
  }
  return false;
}

export function cloneObject(target: any, persistOwnProps = true) {
  const obj =
    target && target.__super
      ? Object.create(target.__super, {
          __super: {
            value: target.__super,
            writable: false,
            enumerable: false,
          },
        })
      : Object.create(Object.prototype);
  persistOwnProps &&
    target &&
    Object.keys(target).forEach((key) => (obj[key] = target[key]));
  return obj;
}

/**
 * 给目标对象添加其他属性，可读取但是不会被遍历。
 * @param target
 * @param props
 */
export function injectPropsToObject(target: any, props: any) {
  const sup = Object.create(target.__super || null);
  Object.keys(props).forEach((key) => (sup[key] = props[key]));
  const result = Object.create(sup);
  Object.keys(target).forEach((key) => (result[key] = target[key]));
  return result;
}

export function extendObject(target: any, src?: any, persistOwnProps = true) {
  const obj = cloneObject(target, persistOwnProps);
  src && Object.keys(src).forEach((key) => (obj[key] = src[key]));
  return obj;
}

export function setVariable(
  data: { [propName: string]: any },
  key: string,
  value: any,
) {
  data = data || {};

  if (key in data) {
    data[key] = value;
    return;
  }

  const parts = keyToPath(key);
  const last = parts.pop() as string;

  while (parts.length) {
    const key = parts.shift() as string;
    if (isPlainObject(data[key])) {
      data = data[key] = {
        ...data[key],
      };
    } else if (Array.isArray(data[key])) {
      data[key] = data[key].concat();
      data = data[key];
    } else if (data[key]) {
      // throw new Error(`目标路径不是纯对象，不能覆盖`);
      // 强行转成对象
      data[key] = {};
      data = data[key];
    } else {
      data[key] = {};
      data = data[key];
    }
  }

  data[last] = value;
}

export function string2regExp(value: string, caseSensitive = false) {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string');
  }

  return new RegExp(
    value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
    !caseSensitive ? 'i' : '',
  );
}

export function qsstringify(
  data: any,
  options: any = {
    arrayFormat: 'indices',
    encodeValuesOnly: true,
  },
) {
  return qs.stringify(data, options);
}

/**
 * 将例如像 a.b.c 或 a[1].b 的字符串转换为路径数组
 *
 * @param string 要转换的字符串
 */
export const keyToPath = (string: string) => {
  const result = [];

  if (string.charCodeAt(0) === '.'.charCodeAt(0)) {
    result.push('');
  }

  string.replace(
    new RegExp(
      '[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
      'g',
    ),
    (match, expression, quote, subString) => {
      let key = match;
      if (quote) {
        key = subString.replace(/\\(\\)?/g, '$1');
      } else if (expression) {
        key = expression.trim();
      }
      result.push(key);
      return '';
    },
  );

  return result;
};
