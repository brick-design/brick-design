import React from 'react';
import styles from './index.less';
import { Direction } from './index';

interface ItemProps {
  onResizeStart: (
    e: React.MouseEvent<HTMLSpanElement>,
    direction: Direction,
  ) => void;
  direction: Direction;
}

const resizeH = ['top', 'bottom'];
const resizeV = ['left', 'right'];
const positionStyles: { [key: string]: React.CSSProperties } = {
  top: {
    top: '-1px',
    cursor: 'row-resize',
  },
  right: {
    right: '-1px',
    cursor: 'col-resize',
  },
  bottom: {
    bottom: '-1px',
    cursor: 'row-resize',
  },
  left: {
    left: '-1px',
    cursor: 'col-resize',
  },
  topRight: {
    right: '-3px',
    top: '-3px',
    cursor: 'ne-resize',
  },
  bottomRight: {
    right: '-3px',
    bottom: '-3px',
    cursor: 'se-resize',
  },
  bottomLeft: {
    left: '-3px',
    bottom: '-3px',
    cursor: 'sw-resize',
  },
  topLeft: {
    left: '-3px',
    top: '-3px',
    cursor: 'nw-resize',
  },
};

export function Item(props: ItemProps) {
  const { onResizeStart, direction } = props;
  let className = styles['resize-item'];
  if (resizeV.includes(direction)) {
    className = styles['resize-item-v'];
  } else if (resizeH.includes(direction)) {
    className = styles['resize-item-h'];
  }
  return (
    <span
      draggable={false}
      style={positionStyles[direction]}
      onMouseDown={(e) => onResizeStart(e, direction)}
      className={className}
    />
  );
}
