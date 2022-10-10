import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  PageConfigType,
  VisualizedStylesPayload,
  SelectedInfoType,
  STATE_PROPS,changeStyles,
} from '@brickd/core';

import { map } from 'lodash';
import { formatUnit } from '@brickd/hooks';
import ResizeItem from './ResizeItem';
import styles from './index.less';
import RadiusItem from './RadiusItem';
import MarginItem from './MarginItem';
import { useSelector } from '../../hooks/useSelector';
import {
  changeElPositionAndSize,
  css, getDegToRad, getDragAngle,
  getElementInfo, getFatherRotate,
  getIframe,
  setPosition,
  getTransform, getSelectedNode,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { DEFAULT_ANIMATION } from '../../common/constants';
import { Direction, getMouseIcon, setCursor } from '../../common/mouseIcons';

type ResizeState = {
  selectedInfo: SelectedInfoType;
  pageConfig: PageConfigType;
};

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


type OriginSizeType = {
  x: number;
  y: number;
  centerX:number;
  centerY:number;
  width: number;
  height: number;
  minWidth: number | null;
  minHeight: number | null;
  maxWidth: number | null;
  maxHeight: number | null;
  direction: Direction;
  mouseRotate:number;
  isRotate?:boolean
};

function OperationPanel() {
  const iframe = useRef(getIframe()).current;
  const { getOperateState, setSubscribe, setOperateState } = useOperate();
  const controlUpdate = (prevState: ResizeState, nextState: ResizeState) => {
    const { selectedInfo } = nextState;
    const {operateSelectedKey}=getOperateState();
    if(prevState.selectedInfo&&!selectedInfo){
      setOperateState({operateSelectedKey:null,selectedNode:null});
    }else if(!prevState.selectedInfo&&selectedInfo&&!operateSelectedKey) {
      const {selectedKey}=selectedInfo;
      setOperateState({operateSelectedKey:selectedKey,selectedNode:getSelectedNode(selectedKey+'-0')});

    }
    return prevState.selectedInfo !== selectedInfo;
  };
  const { selectedInfo } = useSelector<ResizeState, STATE_PROPS>(
    ['selectedInfo'],
    controlUpdate,
  );
  const { selectedKey } = selectedInfo || {};
  const resizeRef = useRef<HTMLDivElement>();
  const operationPanelRef = useRef<HTMLDivElement>();
  const originSizeRef = useRef<OriginSizeType>();
  const styleResultRef = useRef<VisualizedStylesPayload>({});
  const baseboardRef = useRef<HTMLDivElement | any>();
  const actionSheetRef = useRef<any>();
  const fatherRotateRef=useRef(0);
  const [isOut, setIsOut] = useState<boolean>(true);
  const [isShowSizeTip, setIsShowSizeTip] = useState(false);

  const changeOperationPanel = useCallback((isMove?:boolean) => {
    const { selectedNode, operateSelectedKey, isModal } = getOperateState();
    if (selectedNode && operateSelectedKey) {
      if(!isMove){
        fatherRotateRef.current=getFatherRotate(selectedNode);
      }
      const {
        left,
        top,
        height: positionHeight,
        width: positionWidth,
      } = getElementInfo(selectedNode, isModal);
      const { width, height, transform } = css(selectedNode);
      changeElPositionAndSize(operationPanelRef.current, {
        left,
        top,
        height: positionHeight,
        width: positionWidth,
        display: 'flex',
        transition: 'none',
      });
      changeElPositionAndSize(resizeRef.current, {
        minWidth: formatUnit(width) || positionWidth,
        minHeight: formatUnit(height) || positionHeight,
        width: formatUnit(width) || positionWidth,
        height: formatUnit(height) || positionHeight,
        transform:getTransform(transform,fatherRotateRef.current),
        transition: 'none',
      });
      setPosition([operationPanelRef.current], isModal);
      resizeRef.current.dataset.size = `${formatUnit(width)}x${formatUnit(
        height,
      )}`;
      if(isMove){
        const {direction,isRotate}=originSizeRef.current;
        const {rotateSvg,sizeSvg}=getMouseIcon(direction,getTransform(transform,fatherRotateRef.current));
        showBaseboard(isRotate?rotateSvg:sizeSvg);
      }

    }
  }, []);

  const initOperationPanel = useCallback(() => {
    const { selectedNode, operateSelectedKey, isModal } = getOperateState();
    if (selectedNode && operateSelectedKey) {
      const {
        left,
        top,
        height: positionHeight,
        width: positionWidth,
      } = getElementInfo(selectedNode, isModal);
      const { width, height, transform } = css(selectedNode);
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
        display: 'flex',
        transition: 'all 100ms',
      });

      changeElPositionAndSize(resizeRef.current, {
        width: formatUnit(width) || positionWidth,
        height: formatUnit(height) || positionHeight,
        transform:getTransform(transform,fatherRotateRef.current),
        transition: 'all 100ms',
      });
      setPosition([operationPanelRef.current], isModal);
      resizeRef.current.dataset.size = `${formatUnit(width)}x${formatUnit(
        height,
      )}`;
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
      contentWindow.removeEventListener('mouseleave', onMouseUp);
      contentWindow.removeEventListener('resize', changeSize);
      contentWindow.removeEventListener('animationend', changeSize);
    };
  }, []);

  if (!selectedKey && operationPanelRef.current) {
    operationPanelRef.current.style.display = 'none';
  }

  const onMouseUp = useCallback((event:MouseEvent) => {
    event.stopPropagation();
    const { selectedNode } = getOperateState();
    setIsShowSizeTip(false);
    originSizeRef.current = undefined;
    baseboardRef.current!.style.display = 'none';
    operationPanelRef.current.style.pointerEvents = 'none';
    operationPanelRef.current.style.transition = DEFAULT_ANIMATION;
    selectedNode && (selectedNode.style.transition = DEFAULT_ANIMATION);
    changeStyles({style:styleResultRef.current});
    styleResultRef.current = {};
  }, [setIsShowSizeTip]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const { selectedNode } = getOperateState();
    if (originSizeRef.current && selectedNode) {
      const { clientX, clientY } = event;
      const { x, y, direction, height, width,isRotate } = originSizeRef.current;
      if(isRotate){
        return changeAngle(event);
      }
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
        styleResultRef.current.width = `${widthResult}px`;
        selectedNode.style.width = `${widthResult}px`;
      }
      if (
        offsetY !== 0 &&
        (minHeight === null || heightResult >= minHeight) &&
        (maxHeight === null || heightResult <= maxHeight)
      ) {
        styleResultRef.current.height = `${heightResult}px`;
        selectedNode.style.height = `${heightResult}px`;
      }
      changeOperationPanel(true);
    }
  }, []);

  const changeAngle=(event:MouseEvent)=>{
    const {centerY,centerX,mouseRotate}=originSizeRef.current;
    const {selectedNode}=getOperateState();
    selectedNode.style.transition = 'none';
   const changeDeg=getDragAngle(event,centerX,centerY);
   const degResult=changeDeg-mouseRotate;
       const transform=`rotate(${degResult}rad)`;
    styleResultRef.current.transform=transform;
    selectedNode.style.transform=transform;

    changeOperationPanel(true);

  };

  const onResizeStart = useCallback(
    function (
      event: React.MouseEvent,
      direction: Direction,
      isRotate: boolean,
    ) {
      event.stopPropagation();
      const { selectedNode } = getOperateState();
      if (!selectedNode) return;
      setIsShowSizeTip(true);
      changeElPositionAndSize(operationPanelRef.current, {
        pointerEvents: 'auto',
        transition: 'none',
      });
      changeElPositionAndSize(resizeRef.current, {
        transition: 'none',
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
        const rect =selectedNode.getBoundingClientRect();
        const centerX=rect.left + rect.width / 2;
        const centerY=rect.top + rect.height / 2;
        getDegToRad(transform);
        originSizeRef.current = {
          x: event.clientX,
          y: event.clientY,
          direction,
          centerX,
          centerY,
          width: formatUnit(width),
          height: formatUnit(height),
          minWidth: formatUnit(minWidth),
          minHeight: formatUnit(minHeight),
          maxWidth: formatUnit(maxWidth),
          maxHeight: formatUnit(maxHeight),
          mouseRotate: getDragAngle(event,centerX,centerY)-getDegToRad(transform),
          isRotate
        };
        const {sizeSvg,rotateSvg}=getMouseIcon(direction,getTransform(transform,fatherRotateRef.current));
        showBaseboard(isRotate?rotateSvg:sizeSvg);
      }
    },
    [setIsShowSizeTip],
  );

  const showBaseboard = useCallback((cursor: string) => {
    const {
      body: { scrollWidth, scrollHeight },
    } = iframe!.contentDocument;

    baseboardRef.current.style.cssText = `
    display:block;
    width:${scrollWidth}px;
    height:${scrollHeight}px;
   ${setCursor(cursor)}
    `;
  }, []);

  return (
    <>
      <div className={styles['operation-panel']} ref={operationPanelRef}>
        <div
          className={`${styles['border-container']} ${
            isShowSizeTip && styles['size-tip']
          }`}
          ref={resizeRef}
        >
          {!!selectedKey && (
            <>
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
                  key={radius}
                />
              ))}
              {map(MarginPosition, (p) => (
                <MarginItem position={p} key={p} />
              ))}
            </>
          )}
        </div>
      </div>
      <div
        ref={baseboardRef}
        className={styles['baseboard']}
      />
    </>
  );
}

export default memo(OperationPanel);
