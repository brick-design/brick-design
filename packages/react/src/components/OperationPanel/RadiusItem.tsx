import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { isEmpty, each } from 'lodash';
import { changeStyles } from '@brickd/core';
import styles from './index.less';
import {
  css,
  formatUnit,
  getIframe,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { DEFAULT_ANIMATION } from '../../common/constants';
import { Radius } from './index';

interface ItemProps {
  radius: Radius;
  onRadiusStart:(cursor:string)=>void
}

export interface RadiusObjectType {
  [key: string]: string;
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

const computePosition = (r: number) => {
  return Math.floor(Math.sqrt((r * r) / 2));
};
function RadiusItem(props: ItemProps) {
  const originRadiusRef = useRef<OriginRadiusType>();
  const radiusResultRef = useRef({});
  const nodeRef = useRef<HTMLElement>();
  const iframe = useRef(getIframe()).current;
  const { getOperateState, setSubscribe, executeKeyListener } = useOperate();
  const [selected, setSelected] = useState(false);
  const [checked, setChecked] = useState(false);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
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
          width,
          height,
        } = originRadiusRef.current;
        let offsetY = 0;
        let offsetX = 0;
        let offsetR = 0;
        let top = 9,
          bottom = 9;
        let position = 0;
        const maxRadius = Math.min(width, height);
        switch (radius) {
          case Radius.topLeft:
            top = borderTopLeftRadius || top;
            offsetY = clientY - y;
            offsetX = clientX - x;
            offsetR = Math.max(offsetY, offsetX);
            position = top + offsetR || position;
            if (position > maxRadius || position < 0) return;
            nodeRef.current.style.top = `${computePosition(position)}px`;
            nodeRef.current.style.left = `${computePosition(position)}px`;
            break;
          case Radius.topRight:
            top = borderTopRightRadius || top;
            offsetY = clientY - y;
            offsetX = x - clientX;
            offsetR = Math.max(offsetY, offsetX);
            position = top + offsetR || position;
            if (position > maxRadius || position < 0) return;
            nodeRef.current.style.top = `${computePosition(position)}px`;
            nodeRef.current.style.right = `${computePosition(position)}px`;
            break;
          case Radius.bottomLeft:
            bottom = borderBottomLeftRadius || bottom;
            offsetX = clientX - x;
            offsetY = y - clientY;
            offsetR = Math.max(offsetY, offsetX);
            position = bottom + offsetR || position;
            if (position > maxRadius || position < 0) return;
            nodeRef.current.style.bottom = `${computePosition(position)}px`;
            nodeRef.current.style.left = `${computePosition(position)}px`;
            break;
          case Radius.bottomRight:
            bottom = borderBottomRightRadius || bottom;
            offsetY = y - clientY;
            offsetX = x - clientX;
            offsetR = Math.max(offsetY, offsetX);
            position = bottom + offsetR || position;
            if (position > maxRadius || position < 0) return;
            nodeRef.current.style.bottom = `${computePosition(position)}px`;
            nodeRef.current.style.right = `${computePosition(position)}px`;
            break;
        }
        nodeRef.current.dataset.radius = `radius:${position}`;
        if (checked) {
          selectedNode.style[radius] = `${position}px`;
          radiusResultRef.current[radius] = `${position}px`;
        } else {
          each(Radius, (r) => {
            selectedNode.style[r] = `${position}px`;
            radiusResultRef.current[r] = `${position}px`;
            if (r !== radius) {
              executeKeyListener(r);
            }
          });
        }
        selectedNode.style.transition = 'none';
      }
    },
    [checked],
  );
  const onMouseDown = useCallback(
    function (event: React.MouseEvent<HTMLSpanElement>) {
      const { selectedNode } = getOperateState();
      const {radius,onRadiusStart}=props;
      if (iframe) {
        const {
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
          width,
          height,
        } = css(selectedNode);
        originRadiusRef.current = {
          x: event.clientX,
          y: event.clientY,
          radius,
          borderTopLeftRadius: formatUnit(borderTopLeftRadius),
          borderTopRightRadius: formatUnit(borderTopRightRadius),
          borderBottomLeftRadius: formatUnit(borderBottomLeftRadius),
          borderBottomRightRadius: formatUnit(borderBottomRightRadius),
          width: formatUnit(width),
          height: formatUnit(height),
        };
        onRadiusStart(radiusStyles[radius].cursor);
        setSelected(true);
        // showBaseboard(iframe, baseboardRef.current);
      }
    },
    [setSelected],
  );

  const onMouseUp = useCallback(() => {
    const { selectedNode } = getOperateState();
    // hiddenBaseboard(baseboardRef.current);
    originRadiusRef.current = undefined;
    changeStyles({ style: radiusResultRef.current });
    radiusResultRef.current = {};
    selectedNode && (selectedNode.style.transition = DEFAULT_ANIMATION);
    setSelected(false);
  }, [setSelected]);

  const resetPosition = useCallback(() => {
    const { selectedNode,hoverNode } = getOperateState();
    if (selectedNode) {
      if(hoverNode===selectedNode){
        nodeRef.current.style.display='block';
      }else if(hoverNode){
        nodeRef.current.style.display='none';
      }
      const { contentWindow } = iframe!;
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      } = contentWindow!.getComputedStyle(selectedNode);
      let top: number | string = computePosition(9),
        bottom: number | string = computePosition(9);
      let radiusNum = 0;
      switch (radius) {
        case Radius.topLeft:
          radiusNum = formatUnit(borderTopLeftRadius);
          top = (radiusNum > 9 ? computePosition(radiusNum) : top) + 'px';
          nodeRef.current.style.top = top;
          nodeRef.current.style.left = top;
          break;
        case Radius.topRight:
          radiusNum = formatUnit(borderTopRightRadius);
          top = (radiusNum > 9 ? computePosition(radiusNum) : top) + 'px';
          nodeRef.current.style.top = top;
          nodeRef.current.style.right = top;
          break;
        case Radius.bottomLeft:
          radiusNum = formatUnit(borderBottomLeftRadius);
          bottom = (radiusNum > 9 ? computePosition(radiusNum) : bottom) + 'px';
          nodeRef.current.style.bottom = bottom;
          nodeRef.current.style.left = bottom;
          break;
        case Radius.bottomRight:
          radiusNum = formatUnit(borderBottomRightRadius);
          bottom = (radiusNum > 9 ? computePosition(radiusNum) : bottom) + 'px';
          nodeRef.current.style.bottom = bottom;
          nodeRef.current.style.right = bottom;
          break;
      }
      nodeRef.current.dataset.radius = `radius:${radiusNum}`;
    }
  }, []);

  useEffect(() => {
    const { contentWindow } = iframe;
    const unSubscribe = setSubscribe(resetPosition);
    const unKeySubscribe = setSubscribe(resetPosition, radius);

    contentWindow.addEventListener('mouseup', onMouseUp);
    contentWindow.addEventListener('mousemove', onMouseMove);
    return () => {
      unSubscribe();
      unKeySubscribe();
      contentWindow.removeEventListener('mouseup', onMouseUp);
      contentWindow.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove,onMouseUp]);

  const { radius } = props;
  return (
    <span
      onClick={() => setChecked(!checked)}
      draggable={false}
      ref={nodeRef}
      style={radiusStyles[radius]}
      onMouseDown={ onMouseDown}
      className={`${styles['radius-item']} ${
              checked && styles['radius-item-checked']
            } ${
              selected
                ? styles['border-radius-selected']
                : styles['border-radius-default']
            }`
      }
    />
  );
}

export default memo(RadiusItem);
