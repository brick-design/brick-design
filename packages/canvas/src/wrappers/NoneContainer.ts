import React, { createElement, memo, useCallback, useEffect, useRef } from 'react';
import { useCommon } from '@brickd/hooks';
import { setDragSortCache } from '@brickd/core';
import {
  CommonPropsType,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import {
  generateRequiredProps,
  getComponent,
  getDragKey,
  getDragSourceFromKey,
  getSelectedNode, getVNode,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useEvents } from '../hooks/useEvents';
import { useOperate } from '../hooks/useOperate';
// import { useNewAddComponent } from '../hooks/useNewAddComponent';
import { useStyleProps } from '../hooks/useStyleProps';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;
  const selectedInfo = useSelect(specialProps);
  const  { isSelected }=selectedInfo;
  const vNode = getVNode(key);
  const { componentName } = vNode;
  const dragKey = getDragKey();
  const isAddComponent = useRef(
    !getDragSourceFromKey('parentKey') && dragKey === key,
  );
  const { setOperateState } = useOperate();
  // useNewAddComponent(key);
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const { index = 0, funParams, item } = pageState;
  const uniqueKey = `${key}-${index}`;
  const { setSelectedNode, ...events } = useEvents(
    specialProps,
    selectedInfo,
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

  const onDragEnter=useCallback((event:React.DragEvent)=>{
    event.stopPropagation();
    setDragSortCache(null);
    if(getDragKey()===key) return;
    setOperateState({
      dropNode:event.target as HTMLElement,
      isDropAble:false,
      index,
      isLock: true,
    });

  },[]);
  const { className, animateClass, ...restProps } = props || {};

  const styleProps= useStyleProps(componentName,specialProps,handlePropsClassName(
    uniqueKey,
    // dragKey===key,
    className,
    animateClass,
  ),selectedInfo);
  if (!isSelected && (!componentName || hidden)) return null;
  return createElement(getComponent(componentName), {
    ...styleProps,
    ...restProps,
    onDragEnter,
    ...events,
    ...generateRequiredProps(componentName),
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
  });
}

export default memo<CommonPropsType>(NoneContainer, propAreEqual);
