import { createElement, memo, useContext } from 'react';

import { get } from 'lodash';
import { useCommon, StaticContext } from '@brickd/hooks';
import { CommonPropsType } from './Container';

function NoneContainer(vProps: CommonPropsType) {
  const { renderKey, ...rest } = vProps;
  const { pageConfig, componentsMap } = useContext(StaticContext);
  const vNode = pageConfig[renderKey];
  const { props, hidden } = useCommon(vNode, rest);
  const { componentName } = vNode;

  if (hidden) return null;
  return createElement(get(componentsMap, componentName, componentName), props);
}

export default memo<CommonPropsType>(NoneContainer);
