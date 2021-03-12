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

const positionStyles: { [key: string]: React.CSSProperties } = {
  top: {
    top: '-3px',
    cursor: 'row-resize',
  },
  right: {
    right: '-3px',
    cursor: 'col-resize',
  },
  bottom: {
    bottom: '-3px',
    cursor: 'row-resize',
  },
  left: {
    left: '-3px',
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
  return (
    <span
      style={positionStyles[direction]}
      onMouseDown={(e) => onResizeStart(e, direction)}
      className={styles['resize-item']}
    />
  );
}
