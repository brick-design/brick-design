import each from 'lodash/each';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { LEGO_BRIDGE, PROPS_TYPES } from 'brickd-core';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import isUndefined from 'lodash/isUndefined';
import { useEffect, useRef } from 'react';

export const SPECIAL_STRING_CONSTANTS: any = {
  'null': null,
};


export const formatSpecialProps = (props: any, propsConfig: any) => {
  const nextProps = props;
  each(props, (v, k) => {
    if (get(propsConfig, k)) {
      if (!isObject(v)) {
        if (SPECIAL_STRING_CONSTANTS[v] !== undefined) {
          nextProps[k] = SPECIAL_STRING_CONSTANTS[v];
        } else if (propsConfig[k].type === PROPS_TYPES.function) {
          const funcTemplate = get(propsConfig, `${k}.placeholder`);
          if (funcTemplate) {
            nextProps[k] = () => eval(funcTemplate);
          } else {
            nextProps[k] = () => void 0;
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


export function usePrevious<T>(value: any) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
<body>
</body>
</html>
`;

export const isEqualKey=(key:string,selectKey?:string|null)=>{
  if(!selectKey) return false
  return selectKey.includes(key)&&parseInt(selectKey)===parseInt(key)

}
export const getIframe=():HTMLIFrameElement|null=>{
  const  iframe=document.getElementById('dnd-iframe')
  if(iframe ) return iframe as HTMLIFrameElement
  return null;
}

export const getComponent=(componentName:string)=>get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName)

export function formatUnit(target:string|null) {
  if(target){
    const result= target.match(/\d+/)
    if(result){
      return Number.parseInt(result[0])
    }
  }

  return null
}
