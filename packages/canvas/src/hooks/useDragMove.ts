import React, { useCallback, useRef } from 'react';
import {
  ROOT,
  setDragSource,
  changeStyles,
  SelectedInfoBaseType,
} from '@brickd/core';
import { formatUnit } from '@brickd/hooks';
import { isEmpty } from 'lodash';
import { UseSelectType } from './useSelect';
import { DEFAULT_ANIMATION, dragImg } from '../common/constants';
import {
  changeElPositionAndSize,
  css,
  EXCLUDE_POSITION,
  freeCalc,
  getIframe,
  initialize, isDragMove, resetGuideLines,
} from '../utils';
import { OperateStateType } from '../components/OperateProvider';

export type OriginalPosition = {
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

export function useDragMove(
  specialProps: SelectedInfoBaseType,
  selectedInfo: UseSelectType,
  getOperateState: ()=>OperateStateType,
) {
  const originalPositionRef = useRef<OriginalPosition>();
  const positionResultRef = useRef<any>();
  const { isSelected, selectedStyleProp } = selectedInfo;
  const { key, parentKey, parentPropName } = specialProps;
  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      event.stopPropagation();

      if (!isSelected) {
        dragImg.style.width = '10px';
        dragImg.style.height = '10px';
        event.dataTransfer.setDragImage(dragImg, 0, 0);
      } else {
        dragImg.style.width = '0px';
        dragImg.style.height = '0px';
        event.dataTransfer.setDragImage(dragImg, 0, 0);
      }
      const { clientX, clientY, target } = event;
      const targetNode = target as HTMLElement;
      const {
        top: pageTop,
        left: pageLeft,
        width,height
      } = targetNode.getBoundingClientRect();
      const offsetX=clientX-pageLeft;
      const offsetY=clientY-pageTop;
      const isDragMoveAble=isDragMove(width,height,offsetX,offsetY);
        setDragSource({
          dragKey: key,
          parentKey,
          parentPropName,
        });
      const {selectedNode}=getOperateState();

      if (isDragMoveAble&&selectedNode===targetNode && key !== ROOT && !selectedStyleProp) {
        targetNode.style.cursor='move';

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
        initialize(parentKey, parentPropName);
        targetNode.style.transition = 'none';
      }
    },
    [isSelected, selectedStyleProp],
  );

  const onDrag = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.persist();
    getIframe().contentWindow.requestAnimationFrame(() => {
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
        changeOperationPanel,
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
      if (EXCLUDE_POSITION.includes(targetNode.style.position)) {
        const {x,y}=freeCalc(left, top, key);
        changeElPositionAndSize(targetNode, { transition: 'none', left:x, top:y });
        positionResultRef.current = { left:x, top:y };
      } else {
        if (!lockedMarginLeft && !lockedMarginTop) {
          changeElPositionAndSize(targetNode, {
            transition: 'none',
            marginLeft,
            marginTop,
          });
          positionResultRef.current = { marginLeft, marginTop };
        } else if (lockedMarginLeft && !lockedMarginTop) {
          changeElPositionAndSize(targetNode, {
            transition: 'none',
            marginRight,
            marginTop,
          });
          positionResultRef.current = { marginRight, marginTop };
        } else if (!lockedMarginLeft && lockedMarginTop) {
          changeElPositionAndSize(targetNode, {
            transition: 'none',
            marginLeft,
            marginBottom,
          });
          positionResultRef.current = { marginLeft, marginBottom };
        } else {
          changeElPositionAndSize(targetNode, {
            transition: 'none',
            marginRight,
            marginBottom,
          });
          positionResultRef.current = { marginRight, marginBottom };
        }
        boxChange(positionResultRef.current);
      }
      changeOperationPanel();

    });
  }, []);

  const onDragEnd = useCallback((event: DragEvent) => {
    event.stopPropagation();
    const {
      changeBoxDisplay,
    } = getOperateState();
    setDragSource(null);
    if (!isEmpty(positionResultRef.current)) {
      changeStyles({ style: positionResultRef.current, isMerge: true });
      changeBoxDisplay('none');
      positionResultRef.current = {};
    }
    resetGuideLines();
    originalPositionRef.current = null;
    const target=event.target as HTMLElement;
    target.style.transition = DEFAULT_ANIMATION;
    target.style.cursor='pointer';
  }, []);
  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
}
