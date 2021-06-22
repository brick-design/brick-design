import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import { css } from '@brickd/react';
import styles from './index.less';
import Icon from '../Icon';
import { moveIcon } from '../../assets';
import Resizeable, { ResizeableProps, ResizeableRefType } from '../Resizeable';

interface NTabsProps extends TabsProps, ResizeableProps {
  resizeClassName?: string;
}

interface MoveType {
  x?: number;
  y?: number;
  top?: number;
  left?: number;
  isMove: boolean;
}

function NTabs(props: NTabsProps) {
  const { resizeClassName, children, onChange, ...rest } = props;
  const originPositionRef = useRef<MoveType>({ isMove: false });
  const [isDrag, setIsDrag] = useState(false);
  const moveDivRef = useRef<ResizeableRefType>();
  const onMoveStart = useCallback(
    function (event: React.MouseEvent) {
      event.stopPropagation();
      const { top, left } = css(moveDivRef.current.target);
      originPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
        top: Number.parseInt(top),
        left: Number.parseInt(left),
        isMove: true,
      };
      setIsDrag(true);
    },
    [setIsDrag],
  );

  const onMoveEnd = useCallback(
    function (event: MouseEvent) {
      event.stopPropagation();
      originPositionRef.current.isMove = false;
      setIsDrag(false);
    },
    [setIsDrag],
  );

  useEffect(() => {
    window.addEventListener('mouseup', onMoveEnd);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onMoveEnd);
      window.removeEventListener('mousemove', onMove);
    };
  }, [onMoveEnd]);

  const onMove = useCallback(function (event: MouseEvent) {
    event.stopPropagation();
    if (!originPositionRef.current.isMove) return;
    const { clientX, clientY } = event;
    const { x, y, top, left } = originPositionRef.current;
    const offsetY = clientY - y;
    const offsetX = clientX - x;
    const newLeft = left + offsetX;
    moveDivRef.current.target.style.left = left + offsetX + 'px';
    const newTop = top + offsetY;
    moveDivRef.current.target.style.top = newTop + 'px';

    originPositionRef.current = {
      x: clientX,
      y: clientY,
      top: newTop,
      left: newLeft,
      isMove: true,
    };
  }, []);

  return (
    <>
      <div
        style={{ display: isDrag ? 'flex' : 'none' }}
        className={styles['placeholder-border']}
      />
      <Resizeable {...rest} ref={moveDivRef} className={resizeClassName}>
        <Tabs
          tabBarExtraContent={
            <Icon
              onMouseDown={onMoveStart}
              icon={moveIcon}
              className={styles['icon-container']}
              iconClass={styles['icon-class']}
            />
          }
          {...rest}
          onChange={onChange}
        >
          {children}
        </Tabs>
      </Resizeable>
    </>
  );
}

export { TabPane };
export default memo(NTabs);
