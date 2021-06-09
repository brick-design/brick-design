import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  PageConfigType,
  resizeChange,
  ResizePayload,
  ROOT,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';

import { get, map } from 'lodash';
import ResizeItem, { positionStyles } from './ResizeItem';
import styles from './index.less';
import RadiusItem from './RadiusItem';
import MarginItem from './MarginItem';
import { useSelector } from '../../hooks/useSelector';
import {
  changeElPositionAndSize,
  css,
  formatUnit,
  getDragKey,
  getElementInfo,
  getIframe, getMatrix,
  setPosition,
} from '../../utils';
import ActionSheet from '../ActionSheet';
import { useOperate } from '../../hooks/useOperate';
import { DEFAULT_ANIMATION } from '../../common/constants';

type ResizeState = {
  selectedInfo: SelectedInfoType;
  pageConfig: PageConfigType;
};

export enum Direction {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
  topRight = 'topRight',
  bottomRight = 'bottomRight',
  bottomLeft = 'bottomLeft',
  topLeft = 'topLeft',
}

export enum Radius {
  topLeft = 'borderTopLeftRadius',
  topRight = 'borderTopRightRadius',
  bottomLeft = 'borderBottomLeftRadius',
  bottomRight = 'borderBottomRightRadius',
}

export enum MarginPosition {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
}

const controlUpdate = (prevState: ResizeState, nextState: ResizeState) => {
  const { selectedInfo, pageConfig } = nextState;
  return (
    prevState.selectedInfo !== selectedInfo ||
    (selectedInfo &&
      prevState.pageConfig !== pageConfig)
  );
};

type OriginSizeType = {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number | null;
  minHeight: number | null;
  maxWidth: number | null;
  maxHeight: number | null;
  direction: Direction;
  rotate: number;
  transformOrigin:string
};

function OperationPanel() {
  const iframe = useRef(getIframe()).current;
  const { selectedInfo, pageConfig } = useSelector<
    ResizeState,
    STATE_PROPS
  >(['selectedInfo', 'pageConfig'], controlUpdate);
  const { getOperateState, setSubscribe, setOperateState } = useOperate();
  const { selectedKey, propName } = selectedInfo || {};
  const resizeRef = useRef<HTMLDivElement>();
  const operationPanelRef = useRef<HTMLDivElement>();
  const originSizeRef = useRef<OriginSizeType>();
  const sizeResultRef = useRef<ResizePayload>({});
  const baseboardRef = useRef<HTMLDivElement | any>();
  const actionSheetRef = useRef<any>();
  const [isOut, setIsOut] = useState<boolean>(true);
  const { childNodes } = pageConfig[selectedKey] || {};

const changeOperationPanel=useCallback(()=>{
  const { selectedNode, operateSelectedKey, isModal } = getOperateState();
  if (selectedNode && operateSelectedKey) {
    const {
      left,
      top,
      height: positionHeight,
      width: positionWidth,
    } = getElementInfo(selectedNode, iframe, isModal);
    const { width, height, transform, } = css(selectedNode);

    changeElPositionAndSize(operationPanelRef.current, {
      left,
      top,
      height: positionHeight,
      width: positionWidth,
      display:'flex',
      transition: 'none'
    });
    changeElPositionAndSize(resizeRef.current, {
      width: formatUnit(width) || positionWidth,
      height: formatUnit(height) || positionHeight,
      transform,
      transition: 'none',
    });
    setPosition([operationPanelRef.current], isModal);
    resizeRef.current.dataset.size=`${formatUnit(width)}x${formatUnit(height)}`;

  }
},[]);

  const initOperationPanel = useCallback(() => {
    const { selectedNode, operateSelectedKey, isModal } = getOperateState();
    if (selectedNode && operateSelectedKey) {
      const {
        left,
        top,
        height: positionHeight,
        width: positionWidth,
      } = getElementInfo(selectedNode, iframe, isModal);
      const { width, height, transform } = css(selectedNode);
      // if(width===0||height===0){
      //   selectedNode.className
      // }
      if (top <= 14 && isOut) {
        setIsOut(false);
      } else if (top > 14 && !isOut) {
        setIsOut(true);
      }
      changeElPositionAndSize(operationPanelRef.current, {
        left,
        top,
        height: positionHeight,
        width: positionWidth,
        display:'flex',
        transition: 'all 100ms'
      });

      changeElPositionAndSize(resizeRef.current, {
        width: formatUnit(width) || positionWidth,
        height: formatUnit(height) || positionHeight,
        transform,
        transition: 'all 100ms',
      });
      setPosition([operationPanelRef.current], isModal);
      resizeRef.current.dataset.size=`${formatUnit(width)}x${formatUnit(height)}`;

    }
  }, []);


  useEffect(() => {
    const contentWindow = iframe!.contentWindow!;
    setOperateState({ changeOperationPanel, actionSheetRef });
    const changeSize = () => initOperationPanel();
    const unSubscribe = setSubscribe(changeSize);
    contentWindow.addEventListener('resize', changeSize);
    contentWindow.addEventListener('animationend', changeSize);
    contentWindow.addEventListener('mouseup', onMouseUp);
    contentWindow.addEventListener('mousemove', onMouseMove);
    contentWindow.addEventListener('mouseleave', onMouseUp);
    return () => {
      unSubscribe();
      contentWindow.removeEventListener('mouseup', onMouseUp);
      contentWindow.removeEventListener('mousemove', onMouseMove);
      contentWindow.removeEventListener('mousemove', onMouseUp);
      contentWindow.removeEventListener('resize', changeSize);
      contentWindow.removeEventListener('animationend', changeSize);
    };
  }, []);


  if (!selectedKey && operationPanelRef.current) {
    operationPanelRef.current.style.display = 'none';
  }

  const onMouseUp = useCallback(() => {
    const { selectedNode } = getOperateState();
    originSizeRef.current = undefined;
    baseboardRef.current!.style.display = 'none';
    operationPanelRef.current.style.pointerEvents = 'none';
    operationPanelRef.current.style.transition = DEFAULT_ANIMATION;
    selectedNode && (selectedNode.style.transition = DEFAULT_ANIMATION);
    resizeChange(sizeResultRef.current);
    sizeResultRef.current = {};
  }, []);

  const onMouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const { selectedNode } = getOperateState();
    if (originSizeRef.current) {
      const { clientX, clientY } = event;
      const { x, y, direction, height, width } = originSizeRef.current;
      let offsetY = 0;
      let offsetX = 0;
      switch (direction) {
        case Direction.left:
          offsetX = x - clientX;
          break;
        case Direction.right:
          offsetX = clientX - x;
          break;
        case Direction.top:
          offsetY = y - clientY;
          break;
        case Direction.bottom:
          offsetY = clientY - y;
          break;
        case Direction.topLeft:
          offsetY = y - clientY;
          offsetX = x - clientX;
          break;
        case Direction.topRight:
          offsetY = y - clientY;
          offsetX = clientX - x;
          break;
        case Direction.bottomLeft:
          offsetX = x - clientX;
          offsetY = clientY - y;
          break;
        case Direction.bottomRight:
          offsetY = clientY - y;
          offsetX = clientX - x;
          break;
      }
      const heightResult = height + offsetY;
      const widthResult = width + offsetX;
      const {
        minWidth,
        maxHeight,
        maxWidth,
        minHeight,
      } = originSizeRef.current;
      selectedNode.style.transition = 'none';

      if (
        offsetX !== 0 &&
        (minWidth === null || widthResult >= minWidth) &&
        (maxWidth === null || widthResult <= maxWidth)
      ) {
        sizeResultRef.current.width = `${widthResult}px`;
        selectedNode.style.width = `${widthResult}px`;
      }
      if (
        offsetY !== 0 &&
        (minHeight === null || heightResult >= minHeight) &&
        (maxHeight === null || heightResult <= maxHeight)
      ) {
        sizeResultRef.current.height = `${heightResult}px`;
        selectedNode.style.height = `${heightResult}px`;

      }
      changeOperationPanel();
    }
  }, []);

  const onResizeStart = useCallback(function (
    event: React.MouseEvent<HTMLSpanElement>,
    direction: Direction,
    isRotate: boolean,
  ) {
    const { selectedNode } = getOperateState();
      changeElPositionAndSize(operationPanelRef.current, {
        pointerEvents: 'auto',
        transition: 'none',
      });
      changeElPositionAndSize(resizeRef.current,{
        transition: 'none'
      });
    if (event && iframe) {
      const {
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        transform,
        transformOrigin
      } = css(selectedNode);
      originSizeRef.current = {
        x: event.clientX,
        y: event.clientY,
        direction,
        width: formatUnit(width),
        height: formatUnit(height),
        minWidth: formatUnit(minWidth),
        minHeight: formatUnit(minHeight),
        maxWidth: formatUnit(maxWidth),
        maxHeight: formatUnit(maxHeight),
        rotate:getMatrix(transform),
        transformOrigin
      };
      showBaseboard(positionStyles[direction].cursor);
    }
  },
  []);

const showBaseboard = useCallback((cursor:string) => {
    const {
      body: { scrollWidth, scrollHeight },
    } = iframe!.contentDocument;
  baseboardRef.current.style.cssText = `
    display:block;
    width:${scrollWidth}px;
    height:${scrollHeight}px;
    cursor:${cursor};
    `;
  },[]);


  const dragKey = getDragKey();
  const isShowSizeTip = selectedKey && dragKey !== selectedKey;
  return (
    <>
      <div  className={styles['operation-panel']} ref={operationPanelRef}>
        <div  className={`${styles['border-container']} ${isShowSizeTip&&styles['size-tip']}`} ref={resizeRef}>
            <ActionSheet
              ref={actionSheetRef}
              isOut={isOut}
              hasChildNodes={
                propName ? !!get(childNodes, propName) : !!childNodes
              }
              isRoot={selectedKey === ROOT}
              keyValue={selectedKey}
            />
          {!!selectedKey&&<>
          {map(Direction, (direction) => (
            <ResizeItem
              onResizeStart={onResizeStart}
              direction={direction}
              key={direction}
            />
          ))}
          {map(Radius, (radius) => (
            <RadiusItem
              onRadiusStart={showBaseboard}
              radius={radius}
              key={radius} />
          ))}
          {map(MarginPosition, (p) => (
            <MarginItem position={p} key={p} />
          ))}
          </>}
        </div>
      </div>
      <div
        ref={baseboardRef}
        id="brick-design-baseboard"
        className={styles['baseboard']}
      />
    </>
  );
}

export default memo(OperationPanel);
