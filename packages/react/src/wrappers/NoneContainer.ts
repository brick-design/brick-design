import { createElement, memo, useEffect, useRef } from 'react';
import { ROOT, STATE_PROPS } from '@brickd/core';
import { useCommon } from '@brickd/hooks';
import { VirtualDOMType } from '@brickd/utils';
import {
  CommonPropsType,
  controlUpdate,
  handlePropsClassName,
  HookState,
  propAreEqual,
  stateSelector,
} from '../common/handleFuns';
import {
  generateRequiredProps,
  getComponent,
  getDragKey,
  getDragSourceFromKey,
  getSelectedNode,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useSelector } from '../hooks/useSelector';
import { useEvents } from '../hooks/useEvents';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;

  const { pageConfig: PageDom } = useSelector<HookState, STATE_PROPS>(
    stateSelector,
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const { isSelected } = useSelect(specialProps);
  const pageConfig = PageDom[ROOT]
    ? PageDom
    : getDragSourceFromKey('vDOMCollection', {});
  const vNode = (pageConfig[key] || {}) as VirtualDOMType;
  const { componentName } = vNode;
  const dragKey = getDragKey();
  const isAddComponent = useRef(
    !getDragSourceFromKey('parentKey') && dragKey === key,
  );
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const { index = 0, funParams, item } = pageState;
  const uniqueKey = `${key}-${index}`;
  const { setSelectedNode, ...events } = useEvents(
    specialProps,
    isSelected,
    props,
    componentName,
  );

  useEffect(() => {
    if (dragKey && domTreeKeys.includes(dragKey)) return;
    if (isAddComponent.current) {
      setSelectedNode(getSelectedNode(uniqueKey));
      isAddComponent.current = false;
    }
  }, [funParams, isSelected, item, dragKey]);

  if (!isSelected && (!componentName || hidden)) return null;
  const { className, animateClass, ...restProps } = props || {};
  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      uniqueKey,
      !!dragKey,
      className,
      animateClass,
    ),
    ...events,
    ...generateRequiredProps(componentName),
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
  });
}

export default memo<CommonPropsType>(NoneContainer, propAreEqual);
