import React, { useEffect, useRef, useState } from 'react';
import {
  ComponentConfigsType,
  resizeChange,
  ResizePayload,
  ROOT,
  SelectedInfoType,
  STATE_PROPS,
  useSelector,
} from 'brickd-core';
import { getIframe } from '../../utils';
import { selectClassTarget } from '../../common/constants';
import { Item } from './Item';
import styles from './index.less';
import map from 'lodash/map';
import {ActionSheet}  from '../ActionSheet';
import get from 'lodash/get';
import { formatUnit } from '../../utils';

type ResizeState = {
  selectedInfo: SelectedInfoType,
  hoverKey: string | null,
  componentConfigs: ComponentConfigsType
}

export enum Direction {top = 'top', right = 'right', bottom = 'bottom', left = 'left', topRight = 'topRight', bottomRight = 'bottomRight', bottomLeft = 'bottomLeft', topLeft = 'topLeft'};

const controlUpdate = (prevState: ResizeState, nextState: ResizeState) => {
  const { selectedInfo, componentConfigs, hoverKey } = nextState;
  return prevState.selectedInfo !== selectedInfo ||
    selectedInfo && (prevState.componentConfigs !== componentConfigs ||
      prevState.hoverKey===null&&hoverKey!==null||
      prevState.hoverKey!==null&&hoverKey===null
    );

};

type OriginSizeType = {
  x: number,
  y: number,
  width: number,
  height: number,
  minWidth: number | null,
  minHeight: number | null,
  maxWidth: number | null,
  maxHeight: number | null,
  direction: Direction
}

export function Resize() {
  const { selectedInfo, hoverKey, componentConfigs } = useSelector<ResizeState, STATE_PROPS>(['selectedInfo', 'componentConfigs', 'hoverKey'], controlUpdate);
  const { selectedKey } = selectedInfo || {};
  const resizeRef = useRef<any>();
  const originSize = useRef<OriginSizeType>();
  const sizeResult = useRef<ResizePayload>({});
  const widthRef = useRef<any>();
  const heightRef = useRef<any>();
  const baseboardRef = useRef<any>();
  const selectNode=useRef<any>();
  const [isOut, setIsOut] = useState<boolean>(true);


  useEffect(() => {
    if (!selectedInfo) {
      resizeRef.current.style.display = 'none';
      return;
    }

    const contentWindow = getIframe()!.contentWindow!;
    const onResize = () => {
      contentWindow.requestAnimationFrame(setSelectedBorder)
    }
    contentWindow.addEventListener('mouseup', onMouseUp);
    contentWindow.addEventListener('mousemove', onMouseMove);
    contentWindow.addEventListener('mouseleave', onMouseUp);
    contentWindow.addEventListener('resize', onResize);

    selectNode.current=getSelectedNode()
    setTimeout(()=>{
      setSelectedBorder();
    },100)
    return () => {
      contentWindow.removeEventListener('mouseup', onMouseUp);
      contentWindow.removeEventListener('mousemove', onMouseMove);
      contentWindow.removeEventListener('mousemove', onMouseUp);
      contentWindow.removeEventListener('resize', onResize);

    };
  }, [selectedInfo, componentConfigs]);

  const onMouseUp = () => {
    originSize.current = undefined;
    baseboardRef.current.style.display = 'none';
    resizeRef.current.style.pointerEvents = 'none';
    resizeChange(sizeResult.current);
    sizeResult.current = {};
  };
  const onMouseMove = (event: MouseEvent) => {
    if (originSize.current) {
      const { clientX, clientY } = event;
      const { x, y, direction, height, width } = originSize.current;
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
      const selectNode = getSelectedNode();
      const { minWidth, maxHeight, maxWidth, minHeight } = originSize.current;
      if (offsetX !== 0 && (minWidth === null || widthResult >= minWidth) && (maxWidth === null || widthResult <= maxWidth)) {
        sizeResult.current.width = `${widthResult}px`;
        selectNode.style.width = `${widthResult}px`;

      }
      if (offsetY !== 0 && (minHeight === null || heightResult >= minHeight) && (maxHeight === null || heightResult <= maxHeight)) {
        sizeResult.current.height = `${heightResult}px`;
        selectNode.style.height = `${heightResult}px`;
      }
      showSize(sizeResult.current.width, sizeResult.current.height);
      setSelectedBorder();
    }

  };


  const showSize = (width?: string, height?: string) => {
    if (width) {
      widthRef.current.innerHTML = width;
    }
    if (height) {
      heightRef.current.innerHTML = height;
    }

  };
  const getSelectedNode = (): HTMLElement => {
    const { contentDocument } = getIframe()!;
    return contentDocument!.getElementsByClassName(selectClassTarget)[0] as HTMLElement;
  };
  const setSelectedBorder = () => {
    if(selectNode.current){
      const { left, top, width, height } = selectNode.current.getBoundingClientRect();
      if (top <= 20 && isOut) {
        setIsOut(false);
      } else if (top > 20&&!isOut) {
        setIsOut(true);
      }
      resizeRef.current.style.width = `${width}px`;
      resizeRef.current.style.height = `${height}px`;
      resizeRef.current.style.top = `${top}px`;
      resizeRef.current.style.left = `${left}px`;
      resizeRef.current.style.display = 'flex';
    }

  };


  function onResizeStart(event: React.MouseEvent<HTMLSpanElement>, direction: Direction) {
    if (event.nativeEvent) {
      const { contentWindow } = getIframe()!;
      const { width, height, minWidth, minHeight, maxWidth, maxHeight } = contentWindow!.getComputedStyle(getSelectedNode());
      originSize.current = {
        x: event.nativeEvent.clientX,
        y: event.nativeEvent.clientY,
        direction,
        width: formatUnit(width)!,
        height: formatUnit(height)!,
        minWidth: formatUnit(minWidth),
        minHeight: formatUnit(minHeight),
        maxWidth: formatUnit(maxWidth),
        maxHeight: formatUnit(maxHeight),
      };
      resizeRef.current.style.pointerEvents = 'auto';
      baseboardRef.current.style.display = 'block';
    }
  }

  const changeWidth = () => {
    widthRef.current.contentEditable = 'true';
  };
  const changeHeight = () => {
    heightRef.current.contentEditable = 'true';
  };

  const updateSize = () => {
    const width = widthRef.current.innerHTML;
    const height = heightRef.current.innerHTML;
    resizeChange({ width, height });
    widthRef.current.contentEditable = 'false';
    heightRef.current.contentEditable = 'false';
  };

  const { width = 'auto', height = 'auto' } = get(componentConfigs, [selectedKey, 'props', 'style'], {});
  const hasChildNodes = !!get(componentConfigs, [selectedKey, 'childNodes']);

  return (
    <>
      <div className={styles['border-container']} ref={resizeRef}>
        {!hoverKey&&<ActionSheet isOut={isOut} hasChildNodes={hasChildNodes} isRoot={selectedKey === ROOT}   />}
        {map(Direction, (direction) => <Item onResizeStart={onResizeStart} direction={direction} key={direction}/>)}
        <div className={hoverKey ? styles['tip-hidden'] : styles['size-tip-width']} ref={widthRef}
             onDoubleClick={updateSize}
             onClick={changeWidth}>{width}</div>
        <div className={hoverKey ? styles['tip-hidden'] : styles['size-tip-height']} ref={heightRef}
             onDoubleClick={updateSize}
             onClick={changeHeight}>{height}</div>
      </div>
      <div ref={baseboardRef} className={styles['baseboard']}/>
    </>
  );
}
