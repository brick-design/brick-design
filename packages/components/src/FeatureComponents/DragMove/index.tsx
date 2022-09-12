import React, { memo, RefObject, useEffect, useState } from 'react';
import { getIframe, useZoom } from '@brickd/canvas';
import styles from './index.less';

interface DragMoveProp {
  canvasRef?: RefObject<HTMLDivElement>;
}
function DragMove(props: DragMoveProp) {
  const { canvasRef } = props;
  const { getZoomState, setZoomState } = useZoom();
  const [isAble, setIsAble] = useState(false);

  function onKeyDown(keyEvent: KeyboardEvent) {
    keyEvent.stopPropagation();
    const { key, ctrlKey, metaKey } = keyEvent;
    if (ctrlKey || metaKey) {
      if (key === 'd') {
        setIsAble(true);
      }

      keyEvent.returnValue = false;
    }
  }
  function onKeyUp(keyEvent: KeyboardEvent) {
    keyEvent.stopPropagation();
    if (isAble) {
      setIsAble(false);
    }
    keyEvent.returnValue = false;
  }

  const wheelEvent = (e: WheelEvent) => {
    const { deltaX, deltaY } = e;
    const { scale } = getZoomState();
    e.preventDefault();
    if (isAble) {
      if (e.ctrlKey) {
        setZoomState({ scale: scale - deltaY * 0.005 });
        return false;
      } else {
        const target = canvasRef.current;
        const { top, left } = getComputedStyle(target);
        target.style.transition = 'none';
        target.style.left = Number.parseInt(left) - deltaX * 2 + 'px';
        target.style.top = Number.parseInt(top) - deltaY * 2 + 'px';
        return false;
      }
    }
  };

  useEffect(() => {
    const { contentWindow } = getIframe() || {};

    addEventListener('wheel', wheelEvent, { passive: false });
    addEventListener('keydown', onKeyDown, { passive: false });
    addEventListener('keyup', onKeyUp, { passive: false });
    if (contentWindow) {
      contentWindow.addEventListener('keydown', onKeyDown, { passive: false });
      contentWindow.addEventListener('keyup', onKeyUp, { passive: false });
    }
    return () => {
      removeEventListener('wheel', wheelEvent);
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
      if (contentWindow) {
        contentWindow.removeEventListener('keydown', onKeyDown);
        contentWindow.removeEventListener('keyup', onKeyUp);
      }
    };
  }, [wheelEvent, onKeyDown, onKeyUp]);
  return (
    <div
      style={{ display: isAble ? 'flex' : 'none' }}
      className={styles['dragMove']}
    />
  );
}

export default memo(DragMove);
