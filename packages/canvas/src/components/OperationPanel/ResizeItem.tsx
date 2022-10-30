import React, { memo, RefObject, useRef } from 'react';
import styles from './index.less';
import { useOperate } from '../../hooks/useOperate';
import { css, getFatherRotate, getTransform } from '../../utils';
import { getMouseIcon, Direction, setCursor } from '../../common/mouseIcons';

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
export const positionStyles: { [key: string]: React.CSSProperties } = {
  top: {
    top: '-1px',
  },
  right: {
    right: '-1px',
  },
  bottom: {
    bottom: '-1px',
  },
  left: {
    left: '-1px',
  },
  topRight: {
    left: 0,
  },
  bottomRight: {
    left: 0,
  },
  bottomLeft: {
    right: 0,
  },
  topLeft: {
    right: 0,
  },
};

const containerPositionStyles: { [key: string]: React.CSSProperties } = {
  topRight: {
    right: '-9px',
    top: '-6px',
    transform: 'rotate(-45deg)',
  },
  bottomRight: {
    right: '-9px',
    bottom: '-6px',
    transform: 'rotate(45deg)',
  },
  bottomLeft: {
    left: '-9px',
    bottom: '-6px',
    transform: 'rotate(-45deg)',
  },
  topLeft: {
    left: '-9px',
    top: '-6px',
    transform: 'rotate(45deg)',
  },
};

function ResizeItem(props: ItemProps) {
  const { onResizeStart, direction } = props;
  const { getOperateState } = useOperate();
  const rotateRef=useRef<HTMLDivElement>();
  const sizeRef=useRef<HTMLDivElement>();
  let className = styles['resize-item'];
  if (resizeV.includes(direction)) {
    className = styles['resize-item-v'];
  } else if (resizeH.includes(direction)) {
    className = styles['resize-item-h'];
  }

  const onRotateHover=(event:React.MouseEvent)=>{
    event.stopPropagation();
    renderMouse(rotateRef,true);

  };


  const renderMouse=(divRef:RefObject<HTMLDivElement>,isRotate?:boolean)=>{
    const {selectedNode}=getOperateState();
    const cssStyle=css(selectedNode);
    if(!cssStyle) return;
    const {
      transform,
    } = css(selectedNode);

    const {sizeSvg,rotateSvg}=getMouseIcon(direction,getTransform(transform,getFatherRotate(selectedNode)));
    const svg=isRotate?rotateSvg:sizeSvg;
    divRef.current.style.cssText=`
    ${divRef.current.style.cssText}    
    ${setCursor(svg)}
`;
  };

  const onSizeHover=(event:React.MouseEvent)=>{
    event.stopPropagation();
    renderMouse(sizeRef);
  };


  if (resizeV.includes(direction) || resizeH.includes(direction)) {
    return (
      <div
        ref={sizeRef}
        draggable={false}
        onMouseOver={onSizeHover}
        style={positionStyles[direction]}
        onMouseDown={(e) => onResizeStart(e, direction)}
        className={className}
      />
    );
  }


  return (
    <div
      ref={rotateRef}
      onMouseOver={onRotateHover}
      draggable={false}
      style={containerPositionStyles[direction]}
      className={styles['item-container']}
      onMouseDown={(e) => onResizeStart(e, direction, true)}
    >
      <div
        ref={sizeRef}
        onMouseOver={onSizeHover}
        draggable={false}
        style={positionStyles[direction]}
        onMouseDown={(e) => onResizeStart(e, direction)}
        className={className}
      />
    </div>
  );
}

export default memo(ResizeItem);
