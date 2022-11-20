import React, { useRef, memo, useCallback } from 'react';
import styles from './index.less';
import DragAndResize, { DragAndResizeRefType } from '../DragAndResize';
import { closeIcon } from '../../assets';
import Icon from '../Icon';
import { ResizeableProps } from '../Resizeable';
import BarButton, { BarButtonProps, BarButtonRefType } from '../BarButton';

export interface DragResizeBarType
  extends ResizeableProps,
    Omit<BarButtonProps, 'dragResizeRef' | 'children'> {
  title?: string;
  barStyle?: React.CSSProperties;
}

function DragResizeBar(props: DragResizeBarType) {
  const { children, title, className, icon, barStyle, ...rest } = props;
  const dragResizeRef = useRef<DragAndResizeRefType>();
  const barButtonRef = useRef<BarButtonRefType>();

  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    barButtonRef.current.closePanel(e);
  }, []);

  const onMoveStart = useCallback((event: React.MouseEvent) => {
    dragResizeRef.current.onMoveStart(event);
  }, []);

  return (
    <BarButton  icon={icon} dragResizeRef={dragResizeRef} ref={barButtonRef} {...rest}>
      <DragAndResize
        bottom
        right
        left
        topLeft
        topRight
        bottomLeft
        bottomRight
        onWheel={(event) => event.stopPropagation()}
        className={`${styles['container']} ${className}`}
        {...rest}
        ref={dragResizeRef}
      >
        <div
          onMouseDown={onMoveStart}
          style={barStyle}
          className={styles['bar']}
        >
          <span>{title}</span>
          <Icon
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClick}
            icon={closeIcon}
            className={`${styles['icon-container']} ${styles['icon-container1']}`}
            iconClass={styles['icon-class']}
          />
        </div>
        {children}
      </DragAndResize>
    </BarButton>
  );
}

export default memo(DragResizeBar);
