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
import ResizeItem from './ResizeItem';
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
  getIframe,
  setPosition,
  showBaseboard,
} from '../../utils';
import ActionSheet from '../ActionSheet';
import { useOperate } from '../../hooks/useOperate';
import { DEFAULT_ANIMATION } from '../../common/constants';

type ResizeState = {
  selectedInfo: SelectedInfoType;
  hoverKey: string | null;
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
  const { selectedInfo, pageConfig, hoverKey } = nextState;
  return (
    prevState.selectedInfo !== selectedInfo ||
    (selectedInfo &&
      (prevState.pageConfig !== pageConfig || prevState.hoverKey !== hoverKey))
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
  transform: string;
};

function OperationPanel() {
  const iframe = useRef(getIframe()).current;
  const { selectedInfo, hoverKey, pageConfig } = useSelector<
    ResizeState,
    STATE_PROPS
  >(['selectedInfo', 'pageConfig', 'hoverKey'], controlUpdate);
  const { getOperateState, setSubscribe, setOperateState } = useOperate();
  const { selectedKey, propName } = selectedInfo || {};
  const resizeRef = useRef<HTMLDivElement>();
  const operationPanelRef = useRef<HTMLDivElement>();
  const originSizeRef = useRef<OriginSizeType>();
  const sizeResultRef = useRef<ResizePayload>({});
  const widthRef = useRef<any>();
  const heightRef = useRef<any>();
  const baseboardRef = useRef<HTMLDivElement | any>();
  const actionSheetRef = useRef<any>();
  const [isOut, setIsOut] = useState<boolean>(true);
  const { props, childNodes } = pageConfig[selectedKey] || {};
  let { width, height } = get(props, 'style', {
    width: 'auto',
    height: 'auto',
  });
  width = width || 'auto';
  height = height || 'auto';

  const setSelectedBorder = useCallback(() => {
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
        transition: 'all 100ms'
      });
      setPosition([operationPanelRef.current], isModal);
    }
  }, []);


  useEffect(() => {
    const contentWindow = iframe!.contentWindow!;
    setOperateState({ operationPanel:operationPanelRef.current, actionSheetRef });
    const changeSize = () => setSelectedBorder();
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
    const { selectedNode,isModal } = getOperateState();
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
      const {left,top,width:newWidth,height:newHeight}=getElementInfo(selectedNode, iframe, isModal);
      changeElPositionAndSize(operationPanelRef.current,{left,top,width:newWidth,height:newHeight});
      changeElPositionAndSize(resizeRef.current,{height:heightResult,width:widthResult});
      showSize(sizeResultRef.current.width, sizeResultRef.current.height);
      showBaseboard(iframe, baseboardRef.current);
    }
  }, []);

  const showSize = useCallback((width?: string, height?: string) => {
    if (width) {
      widthRef.current.innerHTML = width;
    }
    if (height) {
      heightRef.current.innerHTML = height;
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
        transform,
      };
      showBaseboardChange();
    }
  },
  []);

  const showBaseboardChange=useCallback(()=>showBaseboard(iframe, baseboardRef.current),[]);


  const dragKey = getDragKey();
  const isHidden = (selectedKey && dragKey === selectedKey) || hoverKey;
  return (
    <>
      <div className={styles['operation-panel']} ref={operationPanelRef}>
        <div className={styles['border-container']} ref={resizeRef}>
          {false && (
            <ActionSheet
              ref={actionSheetRef}
              isOut={isOut}
              hasChildNodes={
                propName ? !!get(childNodes, propName) : !!childNodes
              }
              isRoot={selectedKey === ROOT}
              keyValue={selectedKey}
            />
          )}
          {map(Direction, (direction) => (
            <ResizeItem
              onResizeStart={onResizeStart}
              direction={direction}
              key={direction}
            />
          ))}
          {map(Radius, (radius) => (
            <RadiusItem
              onRadiusStart={showBaseboardChange}
              radius={radius}
              key={radius} />
          ))}
          {map(MarginPosition, (p) => (
            <MarginItem position={p} key={p} />
          ))}
          <div
            className={
              isHidden ? styles['tip-hidden'] : styles['size-tip-width']
            }
            ref={widthRef}
          >
            {width}
          </div>
          <div
            className={
              isHidden ? styles['tip-hidden'] : styles['size-tip-height']
            }
            ref={heightRef}
          >
            {height}
          </div>
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
