import { createElement, forwardRef, memo, useEffect, useRef } from 'react';
import { clearDragSource, ROOT, STATE_PROPS } from '@brickd/core';
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
  getDragSourceVDom,
  getIframe,
  getSelectedNode,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useSelector } from '../hooks/useSelector';
import { useEvents } from '../hooks/useEvents';

function NoneContainer(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;
  const { pageConfig: PageDom } = useSelector<HookState, STATE_PROPS>(
    stateSelector,
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const { isSelected, lockedKey } = useSelect(specialProps);
  const pageConfig = PageDom[ROOT] ? PageDom : getDragSourceVDom();
  const vNode = (pageConfig[key] || {}) as VirtualDOMType;
  const { componentName } = vNode;
  const { props, hidden,pageState } = useCommon(vNode, rest);
  const{index}=pageState;
  const parentRootNode = useRef<HTMLElement>();
  const {
    onClick,
    onDoubleClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
  } = useEvents(parentRootNode, specialProps, isSelected);
  useEffect(() => {
    if (!parentRootNode.current && !getDragKey()) {
      const iframe = getIframe();
      parentRootNode.current = getSelectedNode(index,key, iframe);
      isSelected && setSelectedNode(parentRootNode.current);
    }
  });

  if (!isSelected && (!componentName || hidden)) return null;
  const { className, animateClass, ...restProps } = props || {};
  const dragKey = getDragKey();
  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      key,
      dragKey === key ||
        (dragKey && !isSelected && domTreeKeys.includes(lockedKey)),
      className,
      animateClass,
      index
    ),
    onDragStart,
    onMouseOver,
    onDoubleClick,
    onClick,
    onDragEnd: clearDragSource,
    ...generateRequiredProps(componentName),
    ...props,
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
    ref,
    ...rest,
  });
}

export default memo<CommonPropsType>(forwardRef(NoneContainer), propAreEqual);
