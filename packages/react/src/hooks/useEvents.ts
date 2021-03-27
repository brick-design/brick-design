import { RefObject, useCallback, useMemo, useRef } from 'react';
import {
  clearDragSource,
  clearSelectedStatus,
  getDragSource,
  overTarget,
  selectComponent,
  SelectedInfoBaseType,
  STATE_PROPS,
} from '@brickd/core';
import {get} from 'lodash';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import {  getDragKey, getIsModalChild } from '../utils';
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
  const positionRef=useRef<{clientX:number,clientY:number}>();
  const parentPositionRef=useRef<string>();
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
      const {clientX,clientY}=event;
      positionRef.current={clientX,clientY};
      parentPositionRef.current=get(nodeRef.current.parentElement,'style.position');
      setTimeout(() => {
        getDragSource({
          dragKey: key,
          parentKey,
          parentPropName,
        });
        isSelected && setOperateState({ selectedNode: null });
      }, 0);
    },
    [isSelected,positionRef.current],
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

  const onDrag=(event: DragEvent)=> {
    // if (!EXCLUDE_POSITION.includes(nodeRef.current.style.position)) {
    //   return;
    // }
    //
    // const { clientY: originalY, clientX: originalX } = positionRef.current
    // const { clientY, clientX } = event;
    // const {top,left}=nodeRef.current.style;
    //
    // nodeRef.current.style.top=`${clientY-originalY+Number.parseInt(top+0)}px`;
    // nodeRef.current.style.left=`${clientX-originalX+Number.parseInt(left+0)}px`;
    // positionRef.current={clientY, clientX}
  };

  const onDragEnd=useCallback(()=>{
    clearDragSource();

  },[]);


  return {
    onDoubleClick,
    onClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
    getOperateState,
    onDrag,
    onDragEnd
  };
}
