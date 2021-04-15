import React, { useCallback, useMemo, useRef } from 'react';
import {
  changeStyles,
  clearDragSource,
  clearSelectedStatus,
  getComponentConfig,
  getDragSource,
  overTarget,
  ROOT,
  selectComponent,
  SelectedInfoBaseType,
  STATE_PROPS,
} from '@brickd/core';
import { isEmpty } from 'lodash';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import {
  changeElPositionAndSize,
  css,
  EXCLUDE_POSITION,
  formatUnit,
  getDragKey,
  getIframe,
  getIsModalChild,
} from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';
import { DEFAULT_ANIMATION, dragImg } from '../common/constants';

type OriginalPosition = {
  originalX: number;
  originalY: number;
  originalMarginLeft: number;
  originalMarginTop: number;
  originalMarginRight: number;
  originalMarginBottom: number;
  topPosition: number;
  leftPosition: number;
  bottomPosition: number;
  rightPosition: number;
  prevClientX: number;
  prevClientY: number;
};

export function useEvents(
  specialProps: SelectedInfoBaseType,
  isSelected: boolean,
  props: any,
  componentName: string,
  propName?: string,
  index?: number,
) {
  const { key, domTreeKeys, parentKey, parentPropName } = specialProps;
  const {
    onMouseOver: onMouseOverFun,
    onClick: onClickFn,
    onDoubleClick: onDoubleClickFn,
  } = props;
  const iframe = useRef(getIframe()).current;
  const originalPositionRef = useRef<OriginalPosition>();
  const positionResultRef = useRef<any>();
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
      e && e.stopPropagation();
      const targetNode = e.target as HTMLElement;
      if (editAbleProp) {
        targetNode.contentEditable = 'true';
      }
      setSelectedNode(targetNode);
      onDoubleClickFn && onDoubleClickFn();
    },
    [onDoubleClickFn, setSelectedNode],
  );

  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      event.stopPropagation();
      iframe.contentDocument.body.style.cursor = 'move';
      event.dataTransfer.setDragImage(dragImg, 0, 0);
      setTimeout(() => {
        getDragSource({
          dragKey: key,
          parentKey,
          parentPropName,
        });
      }, 0);
      if (isSelected && key !== ROOT) {
        const { clientX, clientY, target } = event;
        const targetNode = target as HTMLElement;
        const {
          marginLeft,
          marginTop,
          marginRight,
          marginBottom,
          top,
          left,
          right,
          bottom,
        } = css(targetNode);
        const {
          top: pageTop,
          left: pageLeft,
        } = targetNode.getBoundingClientRect();
        const {
          top: parentPageTop,
          left: parentPageLeft,
        } = targetNode.parentElement.getBoundingClientRect();
        let topPosition = formatUnit(top),
          leftPosition = formatUnit(left);
        const rightPosition = formatUnit(right),
          bottomPosition = formatUnit(bottom);
        if (
          topPosition === 0 &&
          leftPosition === 0 &&
          rightPosition === 0 &&
          bottomPosition === 0
        ) {
          if (pageLeft <= parentPageLeft && pageTop >= parentPageTop) {
            topPosition = pageTop - parentPageTop;
            leftPosition = pageLeft - parentPageLeft;
          }
        }
        originalPositionRef.current = {
          topPosition,
          leftPosition,
          rightPosition,
          bottomPosition,
          originalX: clientX,
          originalY: clientY,
          originalMarginLeft: formatUnit(marginLeft),
          originalMarginTop: formatUnit(marginTop),
          originalMarginRight: formatUnit(marginRight),
          originalMarginBottom: formatUnit(marginBottom),
          prevClientX: clientX,
          prevClientY: clientY,
        };
        console.log('marginLeft>>>>>>', originalPositionRef.current);

        targetNode.style.transition = 'none';
      }
    },
    [isSelected],
  );

  const onClick = useCallback(
    (e: Event) => {
      e && e.stopPropagation();
      if (isSelected) return;
      clearSelectedStatus();
      setOperateState({ selectedNode: null });
      onClickFn && onClickFn();
    },
    [onClickFn, isSelected],
  );

  const onMouseOver = useCallback(
    (event: Event) => {
      event.stopPropagation();
      if (getDragKey()) {
        setOperateState({ hoverNode: null, operateHoverKey: null });
      } else {
        setOperateState({
          hoverNode: event.target as HTMLElement,
          operateHoverKey: key,
        });
        overTarget({
          hoverKey: key,
        });
      }
      if (typeof onMouseOverFun === 'function') onMouseOverFun();
    },
    [onMouseOverFun],
  );

  const onDrag = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.persist();
    if (!originalPositionRef.current) return;
    const { clientY, clientX, target } = event;
    const {
      originalY,
      originalX,
      originalMarginLeft,
      originalMarginTop,
      originalMarginBottom,
      originalMarginRight,
      prevClientY,
      prevClientX,
      topPosition,
      leftPosition,
    } = originalPositionRef.current;
    const currentOffsetX = clientX - prevClientX;
    const currentOffsetY = clientY - prevClientY;
    if (
      Math.abs(currentOffsetX) > 500 ||
      Math.abs(currentOffsetY) > 500 ||
      (currentOffsetX === 0 && currentOffsetY === 0)
    ) {
      return;
    }
    originalPositionRef.current['prevClientX'] = clientX;
    originalPositionRef.current['prevClientY'] = clientY;
    const targetNode = target as HTMLElement;
    const {
      operationPanel,
      boxChange,
      lockedMarginLeft,
      lockedMarginTop,
    } = getOperateState();
    const offsetY = clientY - originalY;
    const offsetX = clientX - originalX;
    const marginLeft = originalMarginLeft + offsetX;
    const marginTop = originalMarginTop + offsetY;
    const marginRight = originalMarginRight - offsetX;
    const marginBottom = originalMarginBottom - offsetY;
    const top = topPosition + offsetY;
    const left = leftPosition + offsetX;
    let isFlowLayout = true;
    if (EXCLUDE_POSITION.includes(targetNode.style.position)) {
      isFlowLayout = false;
      changeElPositionAndSize(targetNode, { left, top });
      positionResultRef.current = { left, top };
    } else {
      if (!lockedMarginLeft && !lockedMarginTop) {
        changeElPositionAndSize(targetNode, { marginLeft, marginTop });
        positionResultRef.current = { marginLeft, marginTop };
      } else if (lockedMarginLeft && !lockedMarginTop) {
        changeElPositionAndSize(targetNode, { marginRight, marginTop });
        positionResultRef.current = { marginRight, marginTop };
      } else if (!lockedMarginLeft && lockedMarginTop) {
        changeElPositionAndSize(targetNode, { marginLeft, marginBottom });
        positionResultRef.current = { marginLeft, marginBottom };
      } else {
        changeElPositionAndSize(targetNode, { marginRight, marginBottom });
        positionResultRef.current = { marginRight, marginBottom };
      }
    }
    const {
      top: pageTop,
      left: pageLeft,
      width,
      height,
    } = targetNode.getBoundingClientRect();
    boxChange(
      width,
      height,
      pageTop,
      pageLeft,
      positionResultRef.current,
      isFlowLayout,
    );
    changeElPositionAndSize(operationPanel,{left:pageLeft, top:pageTop,	transition:'none'});
  }, []);

  const onDragEnd = useCallback((event: DragEvent) => {
    event.stopPropagation();
    const {
      // actionSheetRef,
      changeBoxDisplay,
    } = getOperateState();
    clearDragSource();
    if (!isEmpty(positionResultRef.current)) {
      changeStyles({ style: positionResultRef.current });
      changeBoxDisplay('none');
      positionResultRef.current = {};
    }
    originalPositionRef.current = null;
    // actionSheetRef.current.setShow(true);
    (event.target as HTMLElement).style.transition = DEFAULT_ANIMATION;
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
