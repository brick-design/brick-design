import React, { createElement, memo, useCallback, useEffect, useRef } from 'react';
import { useCommon } from '@brickd/hooks';
import { addComponent, getComponentConfig, getSelector, setDragSortCache, setDropTarget } from '@brickd/core';
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
  getDragKey, getSelectedNode,
  // getDragSourceFromKey,
  // getSelectedNode,
  getVNode, isAllowAdd, isAllowDrop, isNeedJudgeFather,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useEvents } from '../hooks/useEvents';
import { useOperate } from '../hooks/useOperate';
// import { useNewAddComponent } from '../hooks/useNewAddComponent';
import { useStyleProps } from '../hooks/useStyleProps';
import { useEye } from '../hooks/useEye';
import { useSelector } from '../hooks/useSelector';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key,parentKey,parentPropName,domTreeKeys },
    ...rest
  } = allProps;
  const selfNodeRef=useRef<HTMLElement>();
  const selectedInfo = useSelect(specialProps);
  const  { isSelected }=selectedInfo;
  const vNode = getVNode(key);
  const { componentName } = vNode;
  useSelector(['']);
  const { setOperateState } = useOperate();
  // useNewAddComponent(key);
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const isShow= useEye(key);
  const { index = 0 } = pageState;
  const uniqueKey = `${key}-${index}`;
  const {  ...events } = useEvents(
    specialProps,
    selectedInfo,
    props,
    componentName,
  );

  const onDragEnter=useCallback((event:DragEvent)=>{
    event.stopPropagation();
    setDragSortCache(null);
    if(getDragKey()===key) return;
    const parentVNode=getVNode(parentKey);
    const {componentName,childNodes}=parentVNode;
    const {  nodePropsConfig} = getComponentConfig(componentName);
    let isDropAble=true;
    if(nodePropsConfig){
      const { childNodesRule } = nodePropsConfig[parentPropName];
      isDropAble =
        isAllowDrop(childNodesRule) &&
        (!isNeedJudgeFather() || isAllowAdd(componentName));
    }
    setOperateState({
      dropNode:(event.target as HTMLElement).parentElement,
      isDropAble,
      index,
      isLock: true,
    });
    if (!isDropAble) return;
    setDropTarget({
      propName:nodePropsConfig?parentPropName:undefined,
      dropKey: parentKey,
      domTreeKeys,
      childNodeKeys: Array.isArray(childNodes)?childNodes:get(childNodes, parentPropName, []),
    });


  },[]);

  const onDrop = useCallback((event: React.DragEvent|MouseEvent) => {
    event.stopPropagation();
    const { selectedInfo } = getSelector(['selectedInfo']);
    const dragKey = getDragKey();
    if (get(selectedInfo,'selectedKey') === dragKey) return;
    setOperateState({ dropNode: null,hoverNode:null });
    addComponent();
    // executeSubject();
  }, []);
  const onDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      // if(interceptDragOver()) return;
      const parentVNode=getVNode(parentKey);
      const {childNodes}=parentVNode;
      const dragKey = getDragKey();
      let childNodeKeys=childNodes;
      if(Array.isArray(childNodes)){
        childNodeKeys=childNodes;
      }else {
        childNodeKeys= get(childNodes, parentPropName, []);

      }
      if (
        childNodeKeys.length === 1 &&
        childNodeKeys.includes(dragKey)
      ) {
        return setDragSortCache(childNodeKeys);
      } else {
        const newChildren = dragSort(
          childNodeKeys,
          (event.target as HTMLElement).parentElement,
          event);
        // const renderChildren = cloneChildNodes(childNodes)||{};
        // renderChildren[propName] = newChildren;
        // if (!isEqual(renderChildren, childNodes)) {
        //   // setChildren(renderChildren);
        // }
        setDragSortCache(newChildren);
      }
    },
    [],
  );
  useEffect(()=>{
    if(!selfNodeRef.current){
      selfNodeRef.current= getSelectedNode(key+'-'+index);
    }
    if(selfNodeRef.current){
      selfNodeRef.current.ondragenter=onDragEnter;
      selfNodeRef.current.ondragover=onDragOver;
      selfNodeRef.current.ondrop=onDrop;
    }

  },[onDragEnter,onDragOver]);



  const { className, animateClass, ...restProps } = props || {};
  const styleProps= useStyleProps(componentName,specialProps,handlePropsClassName(
    uniqueKey,
    // dragKey===key,
    className,
    animateClass,
    isShow
  ),selectedInfo);
  if (!isSelected && (!componentName || hidden)) return null;
  return createElement(getComponent(componentName), {
    ...styleProps,
    ...restProps,
    ...events,
    ...generateRequiredProps(componentName),
    draggable: true
  });
}

export default memo<CommonPropsType>(NoneContainer, propAreEqual);
