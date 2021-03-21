import { RefObject, useCallback, useMemo } from 'react';
import {
  clearSelectedStatus,
  getDragSource,
  overTarget,
  selectComponent,
  SelectedInfoBaseType,
  STATE_PROPS,
} from '@brickd/core';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import { getDragKey, getIsModalChild } from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';

export function useEvents(
  nodeRef: RefObject<HTMLElement>,
  specialProps: SelectedInfoBaseType,
  isSelected: boolean,
  props:any,
  propName?: string,
  index?: number,
) {
  const { key, domTreeKeys, parentKey, parentPropName } = specialProps;
  const {onMouseOver:onMouseOverFun}=props;
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    ['pageConfig'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState, getOperateState } = useOperate(isModal);

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

  const onDoubleClick = useCallback(
    (e: Event) => {
      e && e.stopPropagation && e.stopPropagation();
      setSelectedNode(nodeRef.current);
    },
    [nodeRef.current,],
  );

  const onDragStart = useCallback(
    (event: DragEvent) => {
      event.stopPropagation();
      setTimeout(() => {
        getDragSource({
          dragKey: key,
          parentKey,
          parentPropName,
        });
        isSelected && setOperateState({ selectedNode: null });
      }, 0);
    },
    [isSelected],
  );

  const onClick = useCallback((e: Event) => {
    e && e.stopPropagation && e.stopPropagation();
    clearSelectedStatus();
    setOperateState({ selectedNode: null });
  }, []);

  const onMouseOver = useCallback(
    (event: Event) => {
      event.stopPropagation();
      if (getDragKey()) {
         setOperateState({ hoverNode: null, operateHoverKey: null });
      }else {
        setOperateState({ hoverNode: nodeRef.current, operateHoverKey: key });
        overTarget({
          hoverKey: key,
        });
      }
      if(typeof onMouseOverFun==='function' ) onMouseOverFun();
    },
    [nodeRef.current,onMouseOverFun],
  );

  return {
    onDoubleClick,
    onClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
    getOperateState,
  };
}
