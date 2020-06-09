import each from 'lodash/each';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { PROPS_TYPES } from 'brickd-core';
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


export function usePrevious<T>(value: any) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<body>
<div style="height: 100%" id="dnd-container">
</div>
</body>
</html>
`;
