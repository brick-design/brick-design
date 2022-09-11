import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  changeProps,
  changeStyles,
  clearSelectedStatus,
  getComponentConfig,
  // overTarget,
  ROOT,
  selectComponent,
  SelectedInfoBaseType, setDragSource,
  STATE_PROPS,
} from '@brickd/core';
import { isEmpty } from 'lodash';
import { formatUnit } from '@brickd/hooks';
import { useOperate } from './useOperate';
import { useSelector } from './useSelector';
import { UseSelectType } from './useSelect';
import {
  changeElPositionAndSize,
  css,
  EXCLUDE_POSITION,
  getDragKey,
  getIframe,
  getIsModalChild,
} from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';
import { DEFAULT_ANIMATION, dragImg } from '../common/constants';

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

export function useEvents(
  specialProps: SelectedInfoBaseType,
  selectedInfo: UseSelectType,
  props: any,
  componentName: string,
  propName?: string,
  index?: number,
) {
  const {isSelected,selectedStyleProp}=selectedInfo;
  const { key, domTreeKeys, parentKey, parentPropName } = specialProps;
  const {
    onMouseOver: onMouseOverFun,
    onClick: onClickFn,
    onDoubleClick: onDoubleClickFn,
  } = props;
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

  const { selectedNode, changeOperationPanel } = getOperateState();

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
      if (targetNode.contentEditable === 'true') {
        return (targetNode.contentEditable = 'false');
      }
      if (editAbleProp) {
        targetNode.contentEditable = 'true';
      }
      setSelectedNode(targetNode);
      onDoubleClickFn && onDoubleClickFn();
    },
    [onDoubleClickFn, setSelectedNode],
  );


  const onClick = useCallback(
    (event: Event) => {
      event && event.stopPropagation();
      clearSelectedStatus();
      setOperateState({ selectedNode: null,operateSelectedKey:null });
      onClickFn && onClickFn();
    },
    [onClickFn, isSelected],
  );

  const onMouseOver = useCallback(
    (event: Event) => {
      event.stopPropagation();
      // const { hoverNode } = getOperateState();
      const dragKey=getDragKey();
      if (dragKey && dragKey===key||isSelected) {
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
    [onMouseOverFun,isSelected],
  );

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
      setDragSource({
        dragKey: key,
        parentKey,
        parentPropName,
      });

      if (isSelected && key !== ROOT&&!selectedStyleProp) {
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

        targetNode.style.transition = 'none';
      }
    },
    [isSelected,selectedStyleProp],
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
      let isFlowLayout = true;
      if (EXCLUDE_POSITION.includes(targetNode.style.position)) {
        isFlowLayout = false;
        changeElPositionAndSize(targetNode, { transition: 'none', left, top });
        positionResultRef.current = { left, top };
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
      }
      boxChange(positionResultRef.current, isFlowLayout);
      changeOperationPanel();
    });
  }, []);

  const onDragEnd = useCallback((event: DragEvent) => {
    event.stopPropagation();
    const {
      // actionSheetRef,
      changeBoxDisplay,
    } = getOperateState();
    setDragSource(null);
    if (!isEmpty(positionResultRef.current)) {
      changeStyles({ style: positionResultRef.current });
      changeBoxDisplay('none');
      positionResultRef.current = {};
    }
    originalPositionRef.current = null;
    // actionSheetRef.current.setShow(true);
    (event.target as HTMLElement).style.transition = DEFAULT_ANIMATION;
    getIframe().contentDocument.body.style.cursor = 'default';
  }, []);

  const onInput = useCallback((event: React.FormEvent) => {
    event.stopPropagation();
    const { changeOperationPanel } = getOperateState();
    changeOperationPanel();
  }, []);

  const onBlur = useCallback((event: React.FormEvent) => {
    event.stopPropagation();
    const target=event.target as HTMLElement;
    target.contentEditable = 'false';
    changeProps({
      props: { [editAbleProp]:target.textContent },
      isMerge: true,
    });
  }, []);

  useEffect(() => {
    if (selectedNode) {
      changeOperationPanel();
    }
  });

  return {
    onDoubleClick,
    onClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
    getOperateState,
    onDrag,
    onDragEnd,
    onInput,
    onBlur,
  };
}
