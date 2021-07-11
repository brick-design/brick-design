import { useEffect, useRef } from 'react';
import { PROPS_TYPES, PropsConfigType } from '@brickd/canvas';
import {each,map,flattenDeep,isEmpty,isEqual} from 'lodash';


export function usePrevious<T>(value: any) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * 用于获取组件名字数组
 * @param data
 * @returns {Array}
 */
export function flattenDeepArray(data: any) {
  return flattenDeep(
    map(data, (v, k) => {
      if (v && v.components) return map(v.components, (_, subK) => subK);
      return k;
    }),
  );
}

/**
 * 格式化字段在属性配置中的路径
 * @param type
 * @param field
 * @param fatherFieldLocation
 * @param tabIndex
 * @returns {string|string}
 */
export const formatPropsFieldConfigLocation = (
  type: PROPS_TYPES,
  field: string,
  fatherFieldLocation: string,
  tabIndex?: number,
) => {
  let fieldConfigLocation = fatherFieldLocation
    ? `${fatherFieldLocation}.`
    : '';
  if (type === PROPS_TYPES.object) {
    fieldConfigLocation = `${fieldConfigLocation}${field}.childPropsConfig`;
  } else if (type === PROPS_TYPES.objectArray) {
    fieldConfigLocation = `${fieldConfigLocation}${field}.childPropsConfig${
      tabIndex !== undefined ? `.[${tabIndex}]` : ''
    }`;
  }
  return fieldConfigLocation;
};
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
 * form 方法受控组件减少不必要渲染
 * @param prevProps
 * @param nextProps
 */
export const propsAreEqual = (prevProps: any, nextProps: any) =>
  isEqual(prevProps.value, nextProps.value);


export const ANIMATION_YES = 'all 200ms';

export const getCssClassProps=(propsConfig:PropsConfigType)=>{
  const cssClassProps= { };
  each(propsConfig,(config,propName)=>{
    const {type}=config;
    if(type===PROPS_TYPES.style||type===PROPS_TYPES.cssClass){
      cssClassProps[propName]=config;
    }
  });
  return cssClassProps;
};

export const getValueType=(v:any)=>{
  if(typeof v==='string'){
    return PROPS_TYPES.string;
  }else if(typeof v==='number'){
    return PROPS_TYPES.number;
  }else if(typeof v==='boolean'){
    return PROPS_TYPES.boolean;
  }else if(Array.isArray(v)){
    if(v.some((sv)=>typeof sv==='string')){
      return PROPS_TYPES.stringArray;
    }else if(v.some((sv)=>typeof sv==='number')){
      return PROPS_TYPES.numberArray;
    }else{
      return PROPS_TYPES.objectArray;
    }
  }else{
    return PROPS_TYPES.object;
  }
};
