import React, { RefObject, useCallback, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import styles from '../Resize/index.less';
import { formatUnit, getIframe } from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { Radius } from '../Resize';

interface ItemProps {
  radius: Radius;
  changeBaseboard: () => void;
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

export function RadiusItem(props: ItemProps, ref: RefObject<HTMLElement>) {
  const { changeBaseboard } = props;
  const originRadiusRef = useRef<OriginRadiusType>();
  const radiusResultRef = useRef({});
  const nodeRef = useRef<HTMLElement>();
  const iframe = useRef(getIframe()).current;
  const { getOperateState } = useOperate();

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
      } = originRadiusRef.current;
      let offsetY = 0;
      let offsetX = 0;
      let offsetR = 0;
      let top = 7,
        bottom = 7;
       let position=0;
      switch (radius) {
        case Radius.topLeft:
         top = borderTopLeftRadius || top;
          offsetY = clientY - y;
          offsetX = clientX - x;
          offsetR = Math.max(offsetY, offsetX);
          position=top + offsetR||position;
          nodeRef.current.style.top = `${position}px`;
          nodeRef.current.style.left = `${position}px`;
          break;
        case Radius.topRight:
           top = borderTopRightRadius || top;
          offsetY = clientY - y;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position=top + offsetR||position;
          nodeRef.current.style.top = `${position}px`;
          nodeRef.current.style.right = `${position}px`;
          break;
        case Radius.bottomLeft:
          bottom = borderBottomLeftRadius || bottom;
          offsetX = clientX - x;
          offsetY = y - clientY;
          offsetR = Math.max(offsetY, offsetX);
          position=bottom + offsetR||position;
          nodeRef.current.style.bottom = `${position}px`;
          nodeRef.current.style.left = `${position}px`;
          break;
        case Radius.bottomRight:
          bottom = borderBottomRightRadius || bottom;

          offsetY = y - clientY;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position=bottom + offsetR||position;
          nodeRef.current.style.bottom = `${position}px`;
          nodeRef.current.style.right = `${position}px`;
          break;
      }
      selectedNode.style[radius] = `${position}px`;
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
      changeBaseboard();
    }
  },
  []);

  const onMouseUp = useCallback(() => {
    originRadiusRef.current = undefined;
    radiusResultRef.current = {};
  }, []);

  useEffect(() => {
    const contentWindow = iframe!.contentWindow!;
    contentWindow.addEventListener('mouseup', onMouseUp);
    contentWindow.addEventListener('mousemove', onMouseMove);

    return () => {
      contentWindow.removeEventListener('mouseup', onMouseUp);
      contentWindow.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const { radius } = props;
  return (
    <span
      ref={nodeRef}
      style={radiusStyles[radius]}
      onMouseDown={(e) => onRadiusStart(e, radius)}
      className={styles['radius-item']}
    />
  );
}
