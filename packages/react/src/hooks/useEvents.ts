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
  propName?: string,
) {
  const { key, domTreeKeys, parentKey, parentPropName } = specialProps;
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    ['pageConfig'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState } = useOperate(isModal);

  const setSelectedNode = useCallback((selectedNode: HTMLElement) => {
    setOperateState({
      selectedNode: selectedNode,
      operateSelectedKey: key,
    });
  }, []);

  const onDoubleClick = useCallback(
    (e: Event) => {
      e && e.stopPropagation && e.stopPropagation();
      setSelectedNode(nodeRef.current);
      selectComponent({ ...specialProps, propName });
    },
    [propName],
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
        return setOperateState({ hoverNode: null, operateHoverKey: null });
      }
      setOperateState({ hoverNode: nodeRef.current, operateHoverKey: key });
      overTarget({
        hoverKey: key,
      });
    },
    [nodeRef.current, key],
  );

  return { onDoubleClick, onClick, onMouseOver, onDragStart, setSelectedNode };
}
