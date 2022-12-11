import React, { useCallback, useEffect, useMemo } from 'react';
import {
  changeProps,
  clearSelectedStatus,
  getComponentConfig,
  getNewDragKey,
  selectComponent,
  SelectedInfoBaseType,
  setNewDragKey,
  STATE_PROPS,
} from '@brickd/core';
import {isEqual} from 'lodash';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import { UseSelectType } from './useSelect';
import { useDragMove } from './useDragMove';
import { getDragKey, getIsModalChild, getSelectedNode, isDragMove, nodeScrollIntoView, usePrevious } from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';
/**
 * 事件处理器
 * @param specialProps
 * @param selectedInfo
 * @param props
 * @param componentName
 * @param propName
 * @param index
 */
export function useEvents(
  specialProps: SelectedInfoBaseType,
  selectedInfo: UseSelectType,
  props: any,
  componentName: string,
  propName?: string,
  index?: number,
) {
  const { isSelected } = selectedInfo;
  const { key, domTreeKeys } = specialProps;
  const prevDomTreeKeys= usePrevious(domTreeKeys);
  const {
    onMouseOver: onMouseOverFun,
    onClick: onClickFn,
  } = props;

  const { editAbleProp } = getComponentConfig(componentName);
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    ['pageConfig'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState, getOperateState } = useOperate(isModal);

  const { ...dragEvent } = useDragMove(
    specialProps,
    selectedInfo,
    getOperateState,
  );
  const { selectedNode, changeOperationPanel } = getOperateState();

  /**
   *设置选这个组件的node接地供操作层展示相应的工具
   */
  const setSelectedNode = useCallback(
    (selectedNode: HTMLElement) => {
      selectComponent({ ...specialProps, propName });
      const { selectedNode:oldSelectedNode } = getOperateState();
      if (oldSelectedNode&&oldSelectedNode.contentEditable === 'true') {
        oldSelectedNode.contentEditable = 'false';
      }
      setOperateState({
        selectedNode: selectedNode,
        operateSelectedKey: key,
        index,
        hoverNode: null,
        operateHoverKey: null
      });
    },
    [propName],
  );

  useEffect(() => {
    /**
     * 初次渲染时
     * 如果组件是未选中的情况，并且组件的key与拖拽的key一致说说明为新组件，
     * 那么默认选中该组件
     */
    if (!isSelected && getNewDragKey() === key||isSelected) {
      const selectedNode=getSelectedNode(key);
      nodeScrollIntoView(selectedNode);
      setSelectedNode(selectedNode);
      setNewDragKey(null);
    }
  }, [isEqual(domTreeKeys,prevDomTreeKeys)]);


  const onClick = useCallback(
    (event: Event) => {
      event && event.stopPropagation();
      const { selectedNode } = getOperateState();
      const targetNode = event.target as HTMLElement;
      const isEditable=  targetNode.contentEditable;
      if (isSelected && selectedNode === targetNode&&(isEditable!=='true')) {
        clearSelectedStatus();
        setOperateState({ selectedNode: null, operateSelectedKey: null });

      } else if(!isSelected||selectedNode!==targetNode) {
        // if (editAbleProp) {
        //   targetNode.contentEditable = 'true';
        //   targetNode.style.outline='none';
        // }
        setSelectedNode(targetNode);
      }

      onClickFn && onClickFn();
    },
    [onClickFn, isSelected, setSelectedNode],
  );

  const onMouseOver = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const dragKey = getDragKey();
      const target=event.target as HTMLElement;
      if (dragKey && dragKey === key) {
        setOperateState({ hoverNode: null, operateHoverKey: null });
      } else {
        setOperateState({
          hoverNode: target,
          operateHoverKey: key,
        });
      }
      if (typeof onMouseOverFun === 'function') onMouseOverFun();
    },
    [onMouseOverFun, isSelected],
  );

  const onInput = useCallback((event: React.FormEvent) => {
    event.stopPropagation();
    const { changeOperationPanel } = getOperateState();
    changeOperationPanel();

  }, []);

  const onBlur = useCallback((event: React.FormEvent) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.contentEditable = 'false';
    const result=target.innerHTML.replaceAll('<div>','\n').replaceAll('</div>','');

    changeProps({
      props: { [editAbleProp]: result},
      isMerge: true,
    });
  }, []);

  useEffect(() => {
    if (selectedNode) {
      changeOperationPanel();
    }
  });

  const onMouseMove=useCallback((event:MouseEvent)=>{
    const {clientX,clientY,target}=event;
    const targetNode=target as HTMLElement;
    const {selectedNode}=getOperateState();
    const {width,height,top,left}=targetNode.getBoundingClientRect();
    if(selectedNode===targetNode&&isDragMove(width,height,clientX-left,clientY-top)){
      targetNode.style.cursor='move';
    }else if(selectedNode===target) {
      targetNode.style.cursor='auto';
    }else {
      targetNode.style.cursor='pointer';

    }
  },[]);

  return {
    onClick,
    onMouseOver,
    onMouseMove,
    getOperateState,
    onInput,
    onBlur,
    ...dragEvent,
  };
}
