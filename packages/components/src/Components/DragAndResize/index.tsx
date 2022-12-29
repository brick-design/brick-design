import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useDragMove } from '@brickd/hooks';
import styles from './index.less';
import { DragProvider } from './DragProvider';
import Resizeable, { ResizeableProps, ResizeableRefType } from '../Resizeable';

export interface DragAndResizeRefType extends ResizeableRefType {
  onMoveStart: (event: MouseEvent | React.MouseEvent) => void;
}

export interface DragAndResizeProp extends ResizeableProps{
  onDragMoveEnd?:()=>void
};

function DragAndResize(
  props: DragAndResizeProp,
  ref: Ref<DragAndResizeRefType>,
) {
  const {onDragMoveEnd}=props;
  const moveDivRef = useRef<ResizeableRefType>({
    target: null,
    changeFold: (_) => _,
  });
  const getTarget = useCallback(
    () => moveDivRef.current.target as HTMLElement,
    [],
  );
  const [isDrag, setIsDrag] = useState(false);
  const [cursor,setCursor]=useState('move');
  const { onMove, onMoveEnd, onMoveStart } = useDragMove(getTarget);

  useImperativeHandle(
    ref,
    () => ({
      onMoveStart: (event: MouseEvent | React.MouseEvent) => {
        onMoveStart(event);
        setIsDrag(true);
      },
      ...moveDivRef.current,
    }),
    [onMoveStart],
  );

  const onMouseMove = (event: React.MouseEvent) => {
    onMove(event);
    moveDivRef.current.onResize(event);
  };

  const onMouseUp = (event: React.MouseEvent) => {
    setIsDrag(false);
    onMoveEnd(event);
    moveDivRef.current.onResizeEnd();
    moveDivRef.current.target.style.pointerEvents = 'auto';
    setCursor('move');
    onDragMoveEnd&&onDragMoveEnd();
  };
  const onResizeStart = () => {
    setIsDrag(true);
    moveDivRef.current.target.style.pointerEvents = 'none';

  };

  return (
    <>
      <div
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ display: isDrag ? 'flex' : 'none',cursor }}
        className={styles['placeholder-border']}
      />
      <DragProvider value={isDrag}>
      <Resizeable onResizeStart={onResizeStart} setCursor={setCursor} {...props} ref={moveDivRef} />
      </DragProvider>
    </>
  );
}
export default memo(forwardRef(DragAndResize));
