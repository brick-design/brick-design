import { RefObject, useCallback, useMemo, useRef } from 'react';
import {
  changeStyles,
  clearDragSource,
  clearSelectedStatus,
  getDragSource,
  overTarget,
  selectComponent,
  SelectedInfoBaseType,
  STATE_PROPS,
} from '@brickd/core';
import { get, isEmpty } from 'lodash';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import {
  css,
  EXCLUDE_POSITION,
  formatUnit,
  getDragKey, getIframe,
  getIsModalChild,
} from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';
import { DEFAULT_ANIMATION, dragImg } from '../common/constants';

type OriginalPosition = {
  clientX: number;
  clientY: number;
  originalMarginLeft: number;
  originalMarginTop: number;
  originalMarginRight: number;
  originalMarginBottom: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  pageLeft: number;
  pageTop: number;
};

export function useEvents(
  nodeRef: RefObject<HTMLElement>,
  specialProps: SelectedInfoBaseType,
  isSelected: boolean,
  props: any,
  propName?: string,
  index?: number,
) {
  const { key, domTreeKeys, parentKey, parentPropName } = specialProps;
  const {
    onMouseOver: onMouseOverFun,
    onClick: onClickFn,
    onDoubleClick: onDoubleClickFn,
  } = props;
  const iframe=useRef(getIframe()).current;
  const originalPositionRef = useRef<OriginalPosition>();
  const parentPositionRef = useRef<string>();
  const positionResultRef = useRef<any>();
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
      onDoubleClickFn && onDoubleClickFn();
    },
    [onDoubleClickFn],
  );

  const onDragStart = useCallback((event: DragEvent) => {
    event.stopPropagation();
    iframe.contentDocument.body.style.cursor = 'move';

    event.dataTransfer.setDragImage(dragImg, 0, 0);
    const { clientX, clientY } = event;
    const {
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      top,
      left,
      right,
      bottom,
    } = css(nodeRef.current);
    const {
      top: pageTop,
      left: pageLeft,
    } = nodeRef.current.getBoundingClientRect();
    originalPositionRef.current = {
      top: formatUnit(top),
      left: formatUnit(left),
      right: formatUnit(right),
      bottom: formatUnit(bottom),
      clientX,
      clientY,
      originalMarginLeft: formatUnit(marginLeft),
      originalMarginTop: formatUnit(marginTop),
      originalMarginRight: formatUnit(marginRight),
      originalMarginBottom: formatUnit(marginBottom),
      pageTop,
      pageLeft,
    };
    parentPositionRef.current = get(
      nodeRef.current.parentElement,
      'style.position',
    );

    setTimeout(() => {
      getDragSource({
        dragKey: key,
        parentKey,
        parentPropName,
      });
    }, 0);

  }, []);

  const onClick = useCallback(
    (e: Event) => {
      e && e.stopPropagation && e.stopPropagation();
      clearSelectedStatus();
      setOperateState({ selectedNode: null });
      onClickFn && onClickFn();
    },
    [onClickFn],
  );

  const onMouseOver = useCallback(
    (event: Event) => {
      event.stopPropagation();
      if (getDragKey()) {
        setOperateState({ hoverNode: null, operateHoverKey: null });
      } else {
        setOperateState({ hoverNode: nodeRef.current, operateHoverKey: key });
        overTarget({
          hoverKey: key,
        });
      }
      if (typeof onMouseOverFun === 'function') onMouseOverFun();
    },
    [nodeRef.current, onMouseOverFun],
  );

  const onDrag = useCallback((event: DragEvent) => {
    event.stopPropagation();
    setTimeout(()=>{
      if(!originalPositionRef.current) return;
      const {
        selectedNode,
        operateSelectedKey,
        resizeChangePosition,
        radiusChangePosition,
        boxChange,
        lockedMarginLeft,
        lockedMarginTop,
      } = getOperateState();
      if (selectedNode === nodeRef.current && operateSelectedKey) {
        const {
          clientY: originalY,
          clientX: originalX,
          originalMarginLeft,
          originalMarginTop,
          originalMarginBottom,
          originalMarginRight,
        } = originalPositionRef.current;
        const { clientY, clientX } = event;
        const offsetY = clientY - originalY;
        const offsetX = clientX - originalX;
        const marginLeft = originalMarginLeft + offsetX;
        const marginTop = originalMarginTop + offsetY;
        const marginRight = originalMarginRight - offsetX;
        const marginBottom = originalMarginBottom - offsetY;
        nodeRef.current.style.transition = 'none';
        if (EXCLUDE_POSITION.includes(nodeRef.current.style.position)) {
          return;
        } else {

          if (!lockedMarginLeft && !lockedMarginTop) {
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginLeft, marginTop };
          } else if (lockedMarginLeft && !lockedMarginTop) {
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginRight, marginTop };
          } else if (!lockedMarginLeft && lockedMarginTop) {
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginLeft, marginBottom };
          } else {
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginRight, marginBottom };
          }

        }
        const {
          top,
          left,
          width,
          height,
        } = nodeRef.current.getBoundingClientRect();
        boxChange(
          width,
          height,
          top,
          left,
          positionResultRef.current
        );
        resizeChangePosition(left, top);
        radiusChangePosition(left, top,width,height,'transition:none;');
      }
    },1);


  }, []);

  const onDragEnd = useCallback((event:DragEvent) => {
    event.stopPropagation();
    const {
      // actionSheetRef,
      changeBoxDisplay } = getOperateState();
    clearDragSource();
    if (!isEmpty(positionResultRef.current)) {
      changeStyles({ style: positionResultRef.current });
      changeBoxDisplay('none');
      positionResultRef.current = {};
    }
    originalPositionRef.current=null;
    // actionSheetRef.current.setShow(true);
    nodeRef.current.style.transition = DEFAULT_ANIMATION;
    iframe.contentDocument.body.style.cursor = 'default';
  }, []);

  return {
    onDoubleClick,
    onClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
    getOperateState,
    onDrag,
    onDragEnd,
  };
}
