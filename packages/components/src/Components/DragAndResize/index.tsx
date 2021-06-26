import React, { forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useDragMove } from '@brickd/hooks';
import styles from './index.less';
import Resizeable, { ResizeableProps, ResizeableRefType } from '../Resizeable';

export interface DragAndResizeRefType extends ResizeableRefType{
  onMoveStart:(event: MouseEvent|React.MouseEvent)=>void
}
export type DragAndResizeProp=ResizeableProps

function DragAndResize(props: DragAndResizeProp,ref:Ref<DragAndResizeRefType>) {
  const moveDivRef = useRef<ResizeableRefType>({target:null,changeFold:_=>_});
  const getTarget=useCallback(()=>moveDivRef.current.target as HTMLElement,[]);
  const [isDrag,setIsDrag]=useState(false);
  const {onMove,onMoveEnd,onMoveStart}=useDragMove(getTarget);

  useImperativeHandle(ref,()=>({onMoveStart:(event:MouseEvent|React.MouseEvent)=>{
    onMoveStart(event);
      setIsDrag(true);
  },
    ...moveDivRef.current
  }),[onMoveStart]);

  const onMouseMove=(event:React.MouseEvent)=>{
    onMove(event);
    moveDivRef.current.onMouseMove(event);
  };

  const onMouseUp=(event:React.MouseEvent)=>{
    setIsDrag(false);
    onMoveEnd(event);
    moveDivRef.current.onMouseUp(event);
    moveDivRef.current.target.style.pointerEvents='auto';

  };
  const onResizeStart=()=>{
    setIsDrag(true);
    moveDivRef.current.target.style.pointerEvents='none';
  };

  return (
    <>
      <div
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ display: isDrag ? 'flex' : 'none' }}
        className={styles['placeholder-border']}
      />
      <Resizeable  onResizeStart={onResizeStart} {...props} ref={moveDivRef}/>
    </>
  );
}
export default memo(forwardRef(DragAndResize));
