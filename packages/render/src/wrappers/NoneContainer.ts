import { createElement, forwardRef, memo, useContext } from 'react';

import { get } from 'lodash';
import { useCommon, StaticContext } from '@brickd/hooks';
import { CommonPropsType } from './Container';
import { useHandleProps } from '../hooks/useHandleProps';

function NoneContainer(vProps: CommonPropsType, ref: any) {
  const { renderKey, ...rest } = vProps;
  const { pageConfig, componentsMap } = useContext(StaticContext);
  const vNode = pageConfig[renderKey];
  const { props, hidden } = useCommon(vNode, rest);
  // eslint-disable-next-line no-undef
  const propsResult = useHandleProps(props, ref);
  const { componentName } = vNode;
  if (hidden) return null;

  return createElement(
    get(componentsMap, componentName, componentName),
    propsResult,
  );
}

export default memo<CommonPropsType>(forwardRef(NoneContainer));
