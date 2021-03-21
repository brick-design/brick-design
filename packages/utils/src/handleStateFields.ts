import { each, isPlainObject } from 'lodash';
import { ChildNodesType, PageConfigType } from './types';

export const ALL_PROPS = '$all';
export function getStateFields(data: any, fieldsRet?: string[]) {
  const ret = fieldsRet || [];
  if (Array.isArray(data)) {
    return data.map((item) => getStateFields(item));
  } else if (!data) {
    return ret;
  }
  each(data, (value, key) => {
    if (value === '$$' || value === '&') {
      ret.push(ALL_PROPS);
    } else if (key !== '$' && key.includes('$')) {
      //todo 字符串方法体
      resolveFieldFromExpression(value, ret);
    } else if (
      typeof value === 'string' &&
      /(\\)?\$(?:([a-z0-9_\.]+|&|\$)|{([^}{]+?)})/gi.test(value)
    ) {
      value.replace(
        /(\\)?\$(?:([a-z0-9_\.]+|&|\$)|{([^}{]+?)})/gi,
        (_, escape) => {
          !escape && resolveVariableAndFilterField(_, ret);
          return '';
        },
      );
    } else if (isPlainObject(value)) {
      getStateFields(value, ret);
    }
  });

  return [...new Set(ret.filter((field) => field !== 'funParams'))];
}
export function getChildrenFields(pageConfig:PageConfigType,childNodes:ChildNodesType){
  const resultFields=[];
  const getFields=(childNodes:string[])=>{
    each(childNodes,nodeKey=>{
      const {loop}=pageConfig[nodeKey];
      if(typeof loop==='string'){
        resultFields.push(...getStateFields({loop}));
      }
    });
  };
  if(childNodes){
    if(Array.isArray(childNodes)){
      getFields(childNodes);
    }else {
      each(childNodes,nodeKeys=>{
        getFields(nodeKeys);
      });
    }
  }

  return resultFields;
}

export const resolveFieldFromExpression = (
  expression: string,
  fieldsRet?: string[],
) => {
  expression.replace(/this\.([a-zA-Z0-9]*)/gi, (b, field) => {
    fieldsRet.push(field);
    return '';
  });
};

export const resolveVariableAndFilterField = (
  path?: string,
  fieldsRet?: string[],
  defaultFilter = '| html',
): any => {
  if (!path) {
    return;
  }
  const m = /^(\\)?\$(?:([a-z0-9_.]+)|{([\s\S]+)})$/i.exec(path);
  if (!m) {
    return;
  }

  const [, escape, key, key2] = m;

  if (escape) {
    return;
  }

  let finalKey: string = key || key2;

  finalKey = finalKey.replace(
    /(\\|\\\$)?\$(?:([a-zA-Z0-9_.]+)|{([^}{]+)})/g,
    (_, escape) => {
      !escape && resolveVariableAndFilterField(_, fieldsRet, defaultFilter);
      return '';
    },
  );

  const paths = finalKey.split(/\s*\|\s*/g);
  finalKey = paths.shift() as string;

  fieldsRet.push(finalKey.split('.').shift());

  return paths.map((filter) => {
    const params = filter
      .replace(
        /([^\\])\\([\:\\])/g,
        (_, affix, content) =>
          `${affix}__${content === ':' ? 'colon' : 'slash'}__`,
      )
      .split(':')
      .map((item) =>
        item.replace(/__(slash|colon)__/g, (_, type) =>
          type === 'colon' ? ':' : '\\',
        ),
      );
    const key = params.shift() as string;

    if (
      [
        'isTrue',
        'isFalse',
        'isMatch',
        'isEquals',
        'notMatch',
        'notEquals',
      ].includes(key)
    ) {
      each(params, (param) => {
        const filed = getStrOrField(param);
        if (filed) {
          fieldsRet.push(filed.split('.').shift());
        }
      });
      // 后面再遇到非类三元filter就重置了吧，不影响再后面的其他三元filter
    }
  });
};

function getStrOrField(value: string) {
  return /(^('|")(.*)\1$)|(^-?\d+$)|(^(-?\d+)\.\d+?$)|(^\[.*\]$)|(,)/.test(
    value,
  )
    ? false
    : value;
}
