import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { isEmpty, each } from 'lodash';
import { changeStyles } from '@brickd/core';
import { formatUnit } from '@brickd/hooks';
import styles from './index.less';
import { changeElPositionAndSize, css, getIframe } from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { DEFAULT_ANIMATION } from '../../common/constants';
import { Radius } from './index';

interface ItemProps {
  radius: Radius;
  onRadiusStart: (cursor: string) => void;
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
  const nodeRef = useRef<HTMLDivElement>();
  const iframe = useRef(getIframe()).current;
  const { getOperateState, setSubscribe, executeKeyListener } = useOperate();
  const [selected, setSelected] = useState(false);
  const [checked, setChecked] = useState(false);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      if (isEmpty(originRadiusRef.current)) return;
      const { selectedNode } = getOperateState();
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
          changeElPositionAndSize(nodeRef.current, {
            top: computePosition(position),
            left: computePosition(position),
          });
          break;
        case Radius.topRight:
          top = borderTopRightRadius || top;
          offsetY = clientY - y;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position = top + offsetR || position;
          if (position > maxRadius || position < 0) return;
          changeElPositionAndSize(nodeRef.current, {
            top: computePosition(position),
            right: computePosition(position),
          });
          break;
        case Radius.bottomLeft:
          bottom = borderBottomLeftRadius || bottom;
          offsetX = clientX - x;
          offsetY = y - clientY;
          offsetR = Math.max(offsetY, offsetX);
          position = bottom + offsetR || position;
          if (position > maxRadius || position < 0) return;
          changeElPositionAndSize(nodeRef.current, {
            bottom: computePosition(position),
            left: computePosition(position),
          });
          break;
        case Radius.bottomRight:
          bottom = borderBottomRightRadius || bottom;
          offsetY = y - clientY;
          offsetX = x - clientX;
          offsetR = Math.max(offsetY, offsetX);
          position = bottom + offsetR || position;
          if (position > maxRadius || position < 0) return;
          changeElPositionAndSize(nodeRef.current, {
            bottom: computePosition(position),
            right: computePosition(position),
          });
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
    },
    [checked],
  );
  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      const { selectedNode } = getOperateState();
      const { radius, onRadiusStart } = props;
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
        onRadiusStart('canvas-radius');
        setSelected(true);
        // showBaseboard(iframe, baseboardRef.current);
      }
      return true;
    },
    [setSelected],
  );

  const onMouseUp = useCallback((event:MouseEvent) => {
    event.stopPropagation();
    if (isEmpty(originRadiusRef.current)) return;
    const { selectedNode } = getOperateState();
    // hiddenBaseboard(baseboardRef.current);
    originRadiusRef.current = undefined;
    changeStyles({ style: radiusResultRef.current, isMerge: true });
    radiusResultRef.current = {};
    selectedNode && (selectedNode.style.transition = DEFAULT_ANIMATION);
    setSelected(false);
  }, [setSelected]);

  const resetPosition = useCallback(() => {
    const { selectedNode, hoverNode } = getOperateState();
    if (selectedNode) {
      if (hoverNode === selectedNode) {
        nodeRef.current.style.display = 'block';
      } else if (hoverNode) {
        nodeRef.current.style.display = 'none';
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
          changeElPositionAndSize(nodeRef.current, { top, left: top });
          break;
        case Radius.topRight:
          radiusNum = formatUnit(borderTopRightRadius);
          top = (radiusNum > 9 ? computePosition(radiusNum) : top) + 'px';
          changeElPositionAndSize(nodeRef.current, { top, right: top });
          break;
        case Radius.bottomLeft:
          radiusNum = formatUnit(borderBottomLeftRadius);
          bottom = (radiusNum > 9 ? computePosition(radiusNum) : bottom) + 'px';
          changeElPositionAndSize(nodeRef.current, { bottom, left: bottom });
          break;
        case Radius.bottomRight:
          radiusNum = formatUnit(borderBottomRightRadius);
          bottom = (radiusNum > 9 ? computePosition(radiusNum) : bottom) + 'px';
          changeElPositionAndSize(nodeRef.current, { bottom, right: bottom });
          break;
      }
      nodeRef.current.dataset.radius = `R:${radiusNum}`;
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
  }, [onMouseMove, onMouseUp]);

  const onLock = (event: React.MouseEvent<HTMLDivElement>) => {
    setChecked(!checked);
  };
  const { radius } = props;
  return (
    <div
      onClick={onLock}
      draggable={false}
      ref={nodeRef}
      style={radiusStyles[radius]}
      onMouseDown={onMouseDown}
      className={`${styles['radius-item']} ${
        checked && styles['radius-item-checked']
      } ${
        selected
          ? styles['border-radius-selected']
          : styles['border-radius-default']
      }`}
    />
  );
}

export default memo(RadiusItem);
