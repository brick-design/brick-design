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
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import { UseSelectType } from './useSelect';
import { useDragMove } from './useDragMove';
import { getDragKey, getIsModalChild, getSelectedNode } from '../utils';
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
  const {
    onMouseOver: onMouseOverFun,
    onClick: onClickFn,
    onDoubleClick: onDoubleClickFn,
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
      setOperateState({
        selectedNode: selectedNode,
        operateSelectedKey: key,
        index,
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
    if (!isSelected && getNewDragKey() === key) {
      setSelectedNode(getSelectedNode(key));
      setNewDragKey(null);
    }
  }, []);

  /**
   * 双击组件如果组件editAbleProp为true，则设置可编辑状态
   */
  const onDoubleClick = useCallback(
    (e: Event) => {
      e && e.stopPropagation();
      const targetNode = e.target as HTMLElement;
      if (targetNode.contentEditable === 'true') {
        return (targetNode.contentEditable = 'false');
      }
      if (editAbleProp) {
        targetNode.contentEditable = 'true';
      }
    },
    [onDoubleClickFn],
  );

  const onClick = useCallback(
    (event: Event) => {
      event && event.stopPropagation();
      const { selectedNode } = getOperateState();
      const targetNode = event.target as HTMLElement;

      if (isSelected && selectedNode === targetNode) {
        clearSelectedStatus();
        setOperateState({ selectedNode: null, operateSelectedKey: null });
      } else {
        setSelectedNode(targetNode);
      }

      onClickFn && onClickFn();
    },
    [onClickFn, isSelected, setSelectedNode],
  );

  const onMouseOver = useCallback(
    (event: Event) => {
      event.stopPropagation();
      // const { hoverNode } = getOperateState();
      const dragKey = getDragKey();
      if (dragKey && dragKey === key) {
        setOperateState({ hoverNode: null, operateHoverKey: null });
      } else {
        setOperateState({
          hoverNode: event.target as HTMLElement,
          operateHoverKey: key,
        });
        // overTarget({
        //   hoverKey: key,
        // });
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
    changeProps({
      props: { [editAbleProp]: target.textContent },
      isMerge: true,
    });
  }, []);

  useEffect(() => {
    if (selectedNode) {
      changeOperationPanel();
    }
  });

  return {
    onClick,
    onMouseOver,
    getOperateState,
    onInput,
    onBlur,
    onDoubleClick,
    ...dragEvent,
  };
}
