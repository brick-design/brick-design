import React, {
  createElement,
  memo,
  useCallback,
} from 'react';
import { useCommon } from '@brickd/hooks';
import {
  addComponent,
  getComponentConfig,
  getSelector,
  setDragSortCache,
  setDropTarget,
} from '@brickd/core';
import { get } from 'lodash';
import {
  CommonPropsType,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import {
  dragSort,
  generateRequiredProps,
  getComponent,
  getDragKey,
  getVNode,
  isAllowAdd,
  isAllowDrop,
  isNeedJudgeFather,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useEvents } from '../hooks/useEvents';
import { useOperate } from '../hooks/useOperate';
import { useStyleProps } from '../hooks/useStyleProps';
import { useEye } from '../hooks/useEye';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, parentKey, parentPropName, domTreeKeys },
    ...rest
  } = allProps;
  const selectedInfo = useSelect(specialProps);
  const { isSelected } = selectedInfo;
  const vNode = getVNode(key);
  const { componentName } = vNode;
  const { setOperateState } = useOperate();
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const isShow = useEye(key);
  const { index = 0 } = pageState;
  const uniqueKey = `${key}-${index}`;
  const { ...events } = useEvents(
    specialProps,
    selectedInfo,
    props,
    componentName,
  );

  const onDragEnter = useCallback((event: DragEvent) => {
    event.stopPropagation();
    setDragSortCache(null);
    if (getDragKey() === key) return;
    const parentVNode = getVNode(parentKey);
    const { componentName, childNodes } = parentVNode;
    const { nodePropsConfig } = getComponentConfig(componentName);
    let isDropAble = true;
    if (nodePropsConfig) {
      const { childNodesRule } = nodePropsConfig[parentPropName];
      isDropAble =
        isAllowDrop(childNodesRule) &&
        (!isNeedJudgeFather() || isAllowAdd(componentName));
    }
    setOperateState({
      dropNode: (event.target as HTMLElement).parentElement,
      isDropAble,
      index,
    });
    if (!isDropAble) return;
    setDropTarget({
      propName: nodePropsConfig ? parentPropName : undefined,
      dropKey: parentKey,
      domTreeKeys,
      childNodeKeys: Array.isArray(childNodes)
        ? childNodes
        : get(childNodes, parentPropName, []),
    });
  }, []);

  const onDrop = useCallback((event: React.DragEvent | MouseEvent) => {
    event.stopPropagation();
    const { selectedInfo } = getSelector(['selectedInfo']);
    const dragKey = getDragKey();
    if (get(selectedInfo, 'selectedKey') === dragKey) return;
    setOperateState({ dropNode: null, hoverNode: null });
    addComponent();
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.stopPropagation();
    const parentVNode = getVNode(parentKey);
    const { childNodes } = parentVNode;
    const dragKey = getDragKey();
    let childNodeKeys = childNodes;
    if (Array.isArray(childNodes)) {
      childNodeKeys = childNodes;
    } else {
      childNodeKeys = get(childNodes, parentPropName, []);
    }
    if (childNodeKeys.length === 1 && childNodeKeys.includes(dragKey)) {
      return setDragSortCache(childNodeKeys);
    } else {
      const newChildren = dragSort(
        childNodeKeys,
        (event.target as HTMLElement).parentElement,
        event,
      );

      setDragSortCache(newChildren);
    }
  }, []);

  const { className, animateClass, ...restProps } = props || {};
  const styleProps = useStyleProps(
    componentName,
    specialProps,
    handlePropsClassName(
      uniqueKey,
      key,
      className,
      animateClass,
      isShow,
    ),
    selectedInfo,
  );
  if (!isSelected && (!componentName || hidden)) return null;
  return createElement(getComponent(componentName), {
    ...styleProps,
    ...restProps,
    ...events,
    onDrop,
    onDragOver,
    onDragEnter,
    ...generateRequiredProps(componentName),
    draggable: true,
  });
}

export default memo<CommonPropsType>(NoneContainer, propAreEqual);
