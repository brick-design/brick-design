import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import { changeStyles } from '@brickd/core';
import styles from './index.less';
import { formatUnit, getIframe, hiddenBaseboard, showBaseboard } from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { Radius } from './index';

interface ItemProps {
  radius: Radius;
}

export interface RadiusObjectType{
  [key: string]:string
}

const radiusStyles: { [key: string]: React.CSSProperties } = {
  borderTopRightRadius: {
    right: '5px',
    top: '5px',
    cursor: 'ne-resize',
  },
  borderBottomRightRadius: {
    right: '5px',
    bottom: '5px',
    cursor: 'se-resize',
  },
  borderBottomLeftRadius: {
    left: '5px',
    bottom: '5px',
    cursor: 'sw-resize',
  },
  borderTopLeftRadius: {
    left: '5px',
    top: '5px',
    cursor: 'nw-resize',
  },
};

type OriginRadiusType = {
  x: number;
  y: number;
  radius: Radius;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
  height: number;
  width: number;
};

const computePosition=(r:number)=>{
  return Math.floor(Math.sqrt(r*r/2));
};
export function RadiusItem(props: ItemProps, ref: RefObject<HTMLElement>) {
  const originRadiusRef = useRef<OriginRadiusType>();
  const radiusResultRef = useRef({});
  const nodeRef = useRef<HTMLElement>();
  const iframe = useRef(getIframe()).current;
  const { getOperateState,setSubscribe } = useOperate();
  const [show,setShow]=useState(false);
  const baseboardRef=useRef<HTMLElement>();
  const onMouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const { selectedNode } = getOperateState();

    if (!isEmpty(originRadiusRef.current)) {
      const { clientX, clientY } = event;
      const {
        x,
        y,
        radius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        width,height
      } = originRadiusRef.current;
      let offsetY = 0;
      let offsetX = 0;
      let offsetR = 0;
      let top = 9,
        bottom = 9;
       let position=0;
       const maxRadius=Math.min(width,height);
      switch (radius) {
        case Radius.topLeft:
         top = borderTopLeftRadius || top;
          offsetY = clientY - y;
          offsetX = clientX - x;
          offsetR = Math.max(offsetY, offsetX);
          position=top + offsetR||position;
          if(position>maxRadius||position<0)return;
          nodeRef.current.style.top = `${computePosition(position)}px`;
          nodeRef.current.style.left = `${computePosition(position)}px`;
          break;
        case Radius.topRight:
           top = borderTopRightRadius || top;
          offsetY = clientY - y;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position=top + offsetR||position;
          if(position>maxRadius||position<0)return;
          nodeRef.current.style.top = `${computePosition(position)}px`;
          nodeRef.current.style.right = `${computePosition(position)}px`;
          break;
        case Radius.bottomLeft:
          bottom = borderBottomLeftRadius || bottom;
          offsetX = clientX - x;
          offsetY = y - clientY;
          offsetR = Math.max(offsetY, offsetX);
          position=bottom + offsetR||position;
          if(position>maxRadius||position<0)return;
          nodeRef.current.style.bottom = `${computePosition(position)}px`;
          nodeRef.current.style.left = `${computePosition(position)}px`;
          break;
        case Radius.bottomRight:
          bottom = borderBottomRightRadius || bottom;
          offsetY = y - clientY;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position=bottom + offsetR||position;
          if(position>maxRadius||position<0)return;
          nodeRef.current.style.bottom = `${computePosition(position)}px`;
          nodeRef.current.style.right = `${computePosition(position)}px`;
          break;
      }
      nodeRef.current.dataset.radius = `${position}px`;
      selectedNode.style[radius] = `${position}px`;
      radiusResultRef.current[radius]=`${position}px`;

    }
  }, []);
  const onRadiusStart = useCallback(function (
    event: React.MouseEvent<HTMLSpanElement>,
    radius: Radius,
  ) {
    const { selectedNode } = getOperateState();
    if (event.nativeEvent && iframe) {
      const { contentWindow } = iframe!;
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        width,
        height,
      } = contentWindow!.getComputedStyle(selectedNode);
      originRadiusRef.current = {
        x: event.nativeEvent.clientX,
        y: event.nativeEvent.clientY,
        radius,
        borderTopLeftRadius: formatUnit(borderTopLeftRadius),
        borderTopRightRadius: formatUnit(borderTopRightRadius),
        borderBottomLeftRadius: formatUnit(borderBottomLeftRadius),
        borderBottomRightRadius: formatUnit(borderBottomRightRadius),
        width: formatUnit(width),
        height: formatUnit(height),
      };
      setShow(true);
      showBaseboard(iframe,baseboardRef.current);
    }
  },
  [setShow]);

  const onMouseUp = useCallback(() => {
    hiddenBaseboard(baseboardRef.current);
    originRadiusRef.current = undefined;
    changeStyles({style:radiusResultRef.current});
    radiusResultRef.current = {};
    setShow(false);

  }, [setShow]);

  const resetPosition=useCallback(()=>{
    const { selectedNode } = getOperateState();
    if (selectedNode&&iframe) {
      const { contentWindow } = iframe!;
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      } = contentWindow!.getComputedStyle(selectedNode);
      let top:number|string = computePosition(9), bottom:number|string = computePosition(9);
      let radiusNum=0;
      switch (radius) {
        case Radius.topLeft:
          radiusNum=formatUnit(borderTopLeftRadius);
          top = (radiusNum>9?computePosition(radiusNum): top)+'px';
          nodeRef.current.style.top = top;
          nodeRef.current.style.left = top;
          break;
        case Radius.topRight:
          radiusNum=formatUnit(borderTopRightRadius);
          top = (radiusNum>9?computePosition(radiusNum): top)+'px';
          nodeRef.current.style.top = top;
          nodeRef.current.style.right = top;
          break;
        case Radius.bottomLeft:
          radiusNum=formatUnit(borderBottomLeftRadius);
          bottom = (radiusNum>9?computePosition(radiusNum): bottom)+'px';
          nodeRef.current.style.bottom = bottom;
          nodeRef.current.style.left = bottom;
          break;
        case Radius.bottomRight:
          radiusNum=formatUnit(borderBottomRightRadius);
          bottom = (radiusNum>9?computePosition(radiusNum): bottom)+'px';
          nodeRef.current.style.bottom = bottom;
          nodeRef.current.style.right = bottom;
          break;
      }
      nodeRef.current.dataset.radius = `${radiusNum}px`;


    }
  },[]);

  useEffect(() => {
    const {contentWindow,contentDocument}=iframe;
    const unSubscribe =setSubscribe(resetPosition);
    if(!baseboardRef.current){
      baseboardRef.current=contentDocument.getElementById('brick-design-baseboard');
    }
    contentWindow.addEventListener('mouseup', onMouseUp);
    contentWindow.addEventListener('mousemove', onMouseMove);
    return () => {
      unSubscribe();
      contentWindow.removeEventListener('mouseup', onMouseUp);
      contentWindow.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseUp]);

  const { radius } = props;
  return (
    <span
      draggable={false}
      ref={nodeRef}
      style={radiusStyles[radius]}
      onMouseDown={(e) => onRadiusStart(e, radius)}
      className={`${styles['radius-item']} ${show&&styles[radius]}`}
    />
  );
}
