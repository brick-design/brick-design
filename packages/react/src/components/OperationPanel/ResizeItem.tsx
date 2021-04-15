import React,{memo} from 'react';
import styles from './index.less';
import { Direction } from './index';

interface ItemProps {
  onResizeStart: (
    e: React.MouseEvent<HTMLSpanElement>,
    direction: Direction,
    isRotate?: boolean,
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
    left: 0,
    cursor: 'ne-resize',
  },
  bottomRight: {
    left: 0,
    cursor: 'se-resize',
  },
  bottomLeft: {
    right: 0,
    cursor: 'sw-resize',
  },
  topLeft: {
    right: 0,
    cursor: 'nw-resize',
  },
};

const containerPositionStyles: { [key: string]: React.CSSProperties } = {
  topRight: {
    right: '-9px',
    top: '-6px',
    transform: 'rotate(-45deg)',
    cursor: 'wait',
  },
  bottomRight: {
    right: '-9px',
    bottom: '-6px',
    transform: 'rotate(45deg)',
    cursor: 'wait',
  },
  bottomLeft: {
    left: '-9px',
    bottom: '-6px',
    transform: 'rotate(-45deg)',
    cursor: 'wait',
  },
  topLeft: {
    left: '-9px',
    top: '-6px',
    transform: 'rotate(45deg)',
    cursor: 'wait',
  },
};

function ResizeItem(props: ItemProps) {
  const { onResizeStart, direction } = props;
  let className = styles['resize-item'];
  if (resizeV.includes(direction)) {
    className = styles['resize-item-v'];
  } else if (resizeH.includes(direction)) {
    className = styles['resize-item-h'];
  }
  if (resizeV.includes(direction) || resizeH.includes(direction)) {
    return (
      <span
        draggable={false}
        style={positionStyles[direction]}
        onMouseDown={(e) => onResizeStart(e, direction)}
        className={className}
      />
    );
  }
  return (
    <div
      style={containerPositionStyles[direction]}
      className={styles['item-container']}
      onMouseDown={(e) => onResizeStart(e, direction, true)}
    >
      <span
        draggable={false}
        style={positionStyles[direction]}
        onMouseDown={(e) => onResizeStart(e, direction)}
        className={className}
      />
    </div>
  );
}

export default memo(ResizeItem);
