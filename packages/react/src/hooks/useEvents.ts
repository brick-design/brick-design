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
  getDragKey,
  getIsModalChild,
} from '../utils';
import { controlUpdate, HookState } from '../common/handleFuns';
import layoutIcon from '../assets/layout_icon.svg';
import { DEFAULT_ANIMATION } from '../common/constants';

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
    const img = new Image(10, 10);
    img.src = layoutIcon;
    event.dataTransfer.setDragImage(img, 0, 0);
    nodeRef.current.style.cursor = 'move';
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
    const {
      selectedNode,
      operateSelectedKey,
      resizeChangePosition,
      radiusChangePosition,
      boxChange,
      isPositionAdd,
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
      let widthAdd = false,
        heightAdd = false;
      nodeRef.current.style.transition = 'none';
      if (EXCLUDE_POSITION.includes(nodeRef.current.style.position)) {
        return;
      } else {
        if (isPositionAdd) {
          if (offsetY >= 0 && offsetX >= 0) {
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginLeft, marginTop };
          } else if (offsetY >= 0 && offsetX < 0) {
            widthAdd = true;
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginRight, marginTop };
          } else if (offsetY < 0 && offsetX >= 0) {
            heightAdd = true;
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginLeft, marginBottom };
          } else {
            widthAdd = true;
            heightAdd = true;
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginRight, marginBottom };
          }
        } else {
          if (offsetY >= 0 && offsetX >= 0) {
            widthAdd = true;
            heightAdd = true;
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginRight, marginBottom };
          } else if (offsetY >= 0 && offsetX < 0) {
            heightAdd = true;
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginBottom = marginBottom + 'px';
            positionResultRef.current = { marginLeft, marginBottom };
          } else if (offsetY < 0 && offsetX >= 0) {
            widthAdd = true;
            nodeRef.current.style.marginRight = marginRight + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginRight, marginTop };
          } else {
            nodeRef.current.style.marginLeft = marginLeft + 'px';
            nodeRef.current.style.marginTop = marginTop + 'px';
            positionResultRef.current = { marginLeft, marginTop };
          }
        }
      }
      const {
        top,
        left,
        right,
        bottom,
        width,
        height,
      } = nodeRef.current.getBoundingClientRect();
      boxChange(
        width,
        height,
        heightAdd ? bottom : top,
        widthAdd ? right : left,
        heightAdd ? marginBottom : marginTop,
        widthAdd ? marginRight : marginLeft,
        heightAdd,
        widthAdd,
      );
      resizeChangePosition(left, top);
      radiusChangePosition(left, top);
    }
  }, []);

  const onDragEnd = useCallback(() => {
    const { actionSheetRef, changeBoxDisplay } = getOperateState();
    clearDragSource();
    if (!isEmpty(positionResultRef.current)) {
      changeStyles({ style: positionResultRef.current });
      changeBoxDisplay('none');
      positionResultRef.current = {};
    }
    actionSheetRef.current.setShow(true);
    nodeRef.current.style.transition = DEFAULT_ANIMATION;
    nodeRef.current.style.cursor = 'default';
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
