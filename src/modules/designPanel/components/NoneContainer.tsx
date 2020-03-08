import React, { createElement, useEffect } from 'react';
import get from 'lodash/get';
import config from '@/configs';

const NoneContainer = (props: any) => {
  const { componentName, isSelected, onClick, ...rest } = props;
  useEffect(() => {
    if (isSelected) {
      onClick();
    }
  }, []);

  return createElement(get(config.OriginalComponents, componentName, componentName), { ...rest, onClick });
};

export default NoneContainer;
