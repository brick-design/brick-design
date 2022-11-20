import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Direction, useResize } from '@brickd/hooks';
import styles from './index.less';
import { ANIMATION_YES } from '../../utils';
import { useActive } from '../../Abilities/PanelActive';

export interface ResizeableProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  defaultHeight?: number;
  defaultWidth?: number;
  onResizeStart?: (event: React.MouseEvent | MouseEvent) => void;
  activeKey?:string

}

type OriginSizeType = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isResize: boolean;
};

export type ChangeFoldParam = {
  isHeight?: boolean;
  isWidth?: boolean;
  heightTarget?: number;
  widthTarget?: number;
};

export interface ResizeableRefType {
  changeFold?: (params: ChangeFoldParam) => void;
  onResize?: (event: React.MouseEvent | MouseEvent) => void;
  onResizeEnd?: () => void;
  target: HTMLDivElement;
}
function Resizeable(props: ResizeableProps, ref: Ref<ResizeableRefType>) {
  const {
    children,
    left,
    right,
    top,
    bottom,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    className,
    defaultHeight,
    defaultWidth,
    activeKey,
    ...rest
  } = props;

  const originSizeRef = useRef<OriginSizeType>({
    isResize: false,
    width: defaultWidth,
    height: defaultHeight,
  });
  const resizeDivRef = useRef<HTMLDivElement>();
  const setActive= useActive(activeKey,resizeDivRef);

  const { onResizeStart, onResize, onResizeEnd } = useResize(resizeDivRef);

  const onFocus=(event:React.FocusEvent)=>{
    event.stopPropagation();
    setActive();
  };
  const changeFold = useCallback((params: ChangeFoldParam) => {
    const { isHeight, isWidth, widthTarget, heightTarget } = params;
    const { height, width } = originSizeRef.current;
    if (isHeight || heightTarget !== undefined) {
      resizeDivRef.current.style.height = `${
        heightTarget !== undefined ? heightTarget : height
      }px`;
    }
    if (isWidth || widthTarget !== undefined) {
      resizeDivRef.current.style.width = `${
        widthTarget !== undefined ? widthTarget : width
      }px`;
    }
    resizeDivRef.current.style.transition = ANIMATION_YES;
  }, []);

  useImperativeHandle<ResizeableRefType, ResizeableRefType>(ref, () => ({
    changeFold,
    onResize,
    onResizeEnd,
    target: resizeDivRef.current,
  }));

  useEffect(() => {
    if (defaultHeight) resizeDivRef.current.style.height = defaultHeight + 'px';
    if (defaultWidth) resizeDivRef.current.style.width = defaultWidth + 'px';
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    props.onResizeStart && props.onResizeStart(event);
  }, []);

  const topResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.top);
    onMouseDown(event);
  }, []);
  const bottomResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.bottom);
    onMouseDown(event);
  }, []);
  const leftResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.left);
    onMouseDown(event);
  }, []);
  const rightResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.right);
    onMouseDown(event);
  }, []);
  const topRightResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.topRight);
    onMouseDown(event);
  }, []);
  const bottomRightResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.bottomRight);
    onMouseDown(event);
  }, []);
  const topLeftResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.topLeft);
    onMouseDown(event);
  }, []);
  const bottomLeftResize = useCallback((event: React.MouseEvent) => {
    onResizeStart(event, Direction.bottomLeft);
    onMouseDown(event);
  }, []);

  return (
    <div
      className={`${styles['container']} ${className}`}
      {...rest}
      onFocus={onFocus}
      ref={resizeDivRef}
    >
      {children}
      {left && (
        <div className={styles['resize-left']} onMouseDown={leftResize} />
      )}
      {right && (
        <div className={styles['resize-right']} onMouseDown={rightResize} />
      )}
      {top && <div className={styles['resize-top']} onMouseDown={topResize} />}
      {bottom && (
        <div className={styles['resize-bottom']} onMouseDown={bottomResize} />
      )}
      {topLeft && (
        <div className={styles['resize-topLeft']} onMouseDown={topLeftResize} />
      )}
      {topRight && (
        <div
          className={styles['resize-topRight']}
          onMouseDown={topRightResize}
        />
      )}
      {bottomLeft && (
        <div
          className={styles['resize-bottomLeft']}
          onMouseDown={bottomLeftResize}
        />
      )}
      {bottomRight && (
        <div
          className={styles['resize-bottomRight']}
          onMouseDown={bottomRightResize}
        />
      )}
    </div>
  );
}

export default memo(forwardRef(Resizeable));
