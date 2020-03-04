import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import each from 'lodash/each';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import uuid from 'uuid';
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import CommonContainer from '@/modules/designPanel/components/CommonContainer';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { PROPS_TYPES } from '@/types/ConfigTypes';
import { CategoryType } from '@/types/CategoryType';
import { namespace } from '@/models';

interface RenderPath {
  path?: string,
  index?: string | number,
  isContainer?: boolean
}

/**
 * 获取路径
 * @param path
 * @param index
 * @param isContainer
 * @returns {*}
 */
export function getPath({ path, index, isContainer }: RenderPath) {
  if (!path && index !== undefined && !isContainer) {
    path = `[${index}]`;
  } else if (path && isContainer) {
    path = `${path}.childNodes`;
  } else if (path && index !== undefined) {
    path = `${path}.childNodes.[${index}]`;
  }
  return path;
}

/**
 * redux封装函数
 * @param props
 * @returns {Function}
 */
export function reduxConnect(props?: string[], options?: object) {
  return connect((state: any) => {
      const resultProps: any = {};
      each(props, (prop) => resultProps[prop] = state[namespace][prop]);
      return resultProps;
    }, undefined, undefined, { ...options },
  );
}

/**
 * 获取组件新的排序
 * @param sortKeys
 * @param oldChildNodes
 * @returns {Array}
 */
export function getNewSortChildNodes(sortKeys: string[], oldChildNodes: VirtualDOMType[], dragNode?: VirtualDOMType) {
  const nextChildNodes: VirtualDOMType[] = [], childMap: { [key: string]: VirtualDOMType } = {};
  each(oldChildNodes, (childNode) => childMap[childNode.key] = childNode);
  each(sortKeys, (key) => {
    if (dragNode && key === dragNode.key) {
      nextChildNodes.push(dragNode);
    } else {
      nextChildNodes.push(childMap[key]);
    }
  });
  return nextChildNodes;
}


/**
 * 生成新的Key
 * @param componentConfig
 * @returns {*}
 */
export const generateNewKey = (componentConfig: VirtualDOMType) => {
  const { childNodes } = componentConfig;
  componentConfig.key = uuid();
  if (childNodes) {
    if (isArray(childNodes)) {
      each(childNodes, childNode => generateNewKey(childNode));
    } else {
      each(childNodes, (v, k) => {
        each(childNodes[k].childNodes, childNode => generateNewKey(childNode));
      });
    }
  }

  return componentConfig;
};
/**
 * 复制配置信息
 * @param childNodes
 * @param selectedKey
 * @returns {*}
 */
export const copyConfig = (childNodes: VirtualDOMType[], selectedKey: string) => {
  for (const componentConfig of childNodes) {
    if (selectedKey.includes(componentConfig.key)) {
      childNodes.push(generateNewKey(cloneDeep(componentConfig)));
      break;
    }
  }
  return childNodes;
};


export const SPECIAL_STRING_CONSTANTS: any = {
  'null': null,
};

export const formatSpecialProps = (props: any, propsConfig: any) => {
  const nextProps = props;
  each(props, (v, k) => {
    if (get(propsConfig,k)) {
      if (!isObject(v)) {
        if (SPECIAL_STRING_CONSTANTS[v] !== undefined) {
          nextProps[k] = SPECIAL_STRING_CONSTANTS[v];
        } else if (propsConfig[k].type === PROPS_TYPES.function) {
          const funcTemplate = get(propsConfig, `${k}.placeholder`);
          if (funcTemplate) {
            nextProps[k] = () => eval(funcTemplate);
          } else {
            nextProps[k] = () => {
            };
          }
        }
      } else if (isObject(v) && !isEmpty(propsConfig[k].childPropsConfig) && isEqual(keys(v), keys(propsConfig[k].childPropsConfig))) {
        formatSpecialProps(v, propsConfig[k].childPropsConfig);
      }
    } else if (isUndefined(v)) {
      delete nextProps[k];
    }

  });
  return nextProps;
};

/**
 * 用于获取组件名字数组
 * @param data
 * @returns {Array}
 */
export function flattenDeepArray(data: CategoryType) {
  return flattenDeep(map(data, (v, k) => {
    if (v&&v.components) return map(v.components, (_, subK) => subK);
    return k;
  }));
}

/**
 * 生成react组件容器
 */
export function generateContainers(componentNames: string[]) {
  const components: any = {};
  each(componentNames, componentName => {
    components[componentName] = (props:any)=><CommonContainer {...props} containerName={componentName}/>;
  });
  return components;
}

/**
 * 过滤掉值为undefined的字段
 * @param value
 * @returns {undefined}
 */
export const filterProps = (value: any) => {
  const props: any = {};
  each(value, (v, k) => {
    if (v !== undefined) {
      props[k] = v;
    }
  });

  return isEmpty(props) ? undefined : props;
};

/**
 * 获取字段在props中的位置
 * @param fieldConfigPath
 * @returns {string}
 */
export const getFieldInPropsPath = (fieldConfigPath: string) => {
  return fieldConfigPath.split('.').filter(path => path !== 'childPropsConfig').join('.');
};
/**
 * 格式化字段在属性配置中的路径
 * @param type
 * @param field
 * @param parentFieldPath
 * @param tabIndex
 * @returns {string|string}
 */
export const formatPropsFieldConfigPath = (type: PROPS_TYPES, field: string, parentFieldPath: string, tabIndex?: number) => {
  let fieldConfigPath = parentFieldPath ? `${parentFieldPath}.` : '';
  if (type === PROPS_TYPES.object) {
    fieldConfigPath = `${fieldConfigPath}${field}.childPropsConfig`;
  } else if (type === PROPS_TYPES.objectArray) {
    fieldConfigPath = `${fieldConfigPath}${field}.childPropsConfig${
      tabIndex !== undefined ? `.[${tabIndex}]` : ''
      }`;
  }
  return fieldConfigPath;
};
/**
 * 处理子节点非空
 * @param selectedComponentInfo
 * @param componentConfigs
 * @returns {boolean}
 */
export const handleRequiredHasChild = (selectedComponentInfo: SelectedComponentInfoType, componentConfigs: VirtualDOMType[]) => {
  const { isRequiredHasChild, path, propPath } = selectedComponentInfo;
  if (!isRequiredHasChild) return false;
  const childNodesPath = getPath({ path: propPath || path, isContainer: true }) || '';
  const result = isEmpty(get(componentConfigs, childNodesPath));
  if (result) {
    message.warning('当前选中组件必须拥有子组件');
  }
  return result;

};

/**
 * form 方法受控组件减少不必要渲染
 * @param prevProps
 * @param nextProps
 */
export const propsAreEqual=(prevProps:any,nextProps:any)=>prevProps.value===nextProps.value

/**
 * 处理父级属性与组件属性的异同
 */
export const diffProps=(restProps:any,props:any)=>{
  each(restProps,(v,k)=>{
    if(!isEqual(props[k],v)){
      props[k]=v
    }
  })

  return props

}


export function usePrevious(value:any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
