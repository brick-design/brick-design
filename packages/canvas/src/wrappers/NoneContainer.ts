import React, { createElement, memo, useCallback, useEffect, useRef } from 'react';
import { useCommon } from '@brickd/hooks';
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
import { useNewAddComponent } from '../hooks/useNewAddComponent';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;
  const { isSelected } = useSelect(specialProps);
  const vNode = getVNode(key);
  const { componentName } = vNode;
  const dragKey = getDragKey();
  const isAddComponent = useRef(
    !getDragSourceFromKey('parentKey') && dragKey === key,
  );
  const { setOperateState } = useOperate();
  useNewAddComponent(key);
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

  const onDragEnter=useCallback((event:React.DragEvent)=>{
    event.stopPropagation();
    setOperateState({
      dropNode:event.target as HTMLElement,
      isDropAble:false,
      index,
      isLock: true,
    });

  },[]);

  if (!isSelected && (!componentName || hidden)) return null;
  const { className, animateClass, ...restProps } = props || {};
  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      uniqueKey,
      false,
      className,
      animateClass,
    ),
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
