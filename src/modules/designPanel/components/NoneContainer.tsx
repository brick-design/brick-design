import React, { createElement, forwardRef, memo, useEffect } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import config from '@/configs';

const NoneContainer = (props: any,ref:any) => {
  const { componentName, isSelected, onClick, ...rest } = props;
  useEffect(() => {
    if (isSelected) {
      onClick();
    }
  }, []);

  return createElement(get(config.OriginalComponents, componentName, componentName), { ...rest, onClick,ref });
};

export default memo(forwardRef(NoneContainer),(prevProps,nextProps)=>isEqual(prevProps,nextProps));
