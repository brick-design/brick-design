import React, { forwardRef, memo, useEffect, useRef } from 'react';
// import {
//   DragSourceType,
//   DropTargetType,
//   SelectedInfoType,
//   // STATE_PROPS,
// } from '@brickd/core';
import styles from './index.less';
// import { useSelector } from '../../hooks/useSelector';
import {
  changeElPositionAndSize,
  getElementInfo,
  getIframe,
  getScalePosition,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { useZoom } from '../../hooks/useZoom';

// type SelectState = {
//   hoverKey: string | null;
//   dropTarget: DropTargetType | null;
//   selectedInfo: SelectedInfoType | null;
//   dragSource: DragSourceType | null;
// };

export type PositionSizeType = {
  width: number;
  height: number;
  top: number;
  left: number;
};

function Guidelines() {
  const topRef = useRef<HTMLDivElement>();
  const bottomRef = useRef<HTMLDivElement>();
  const leftRef = useRef<HTMLDivElement>();
  const rightRef = useRef<HTMLDivElement>();
  const iframe = useRef(getIframe()).current;
  const { getZoomState } = useZoom();
  const canvas = useRef(document.getElementById('brickd-canvas')).current;
  const canvasContainer = useRef(
    document.getElementById('brickd-canvas-container'),
  ).current;
  // const { hoverKey } = useSelector<SelectState, STATE_PROPS>(['hoverKey']);
  const { getOperateState, setSubscribe } = useOperate();
  // console.log('hoverKey>>>>>>>>',hoverKey,dropNode);

  useEffect(() => {
    const { contentWindow } = iframe;
    const renderGuideLines = () => {
      const { hoverNode, isModal } = getOperateState();
      if (hoverNode) {
        const { left, top, bottom, right } = getElementInfo(hoverNode, isModal);
        const { scrollY, scrollX } = contentWindow;
        const { scale } = getZoomState();
        const positionSize = getScalePosition(canvas, canvasContainer, scale);
        const { width, height } = positionSize;

        changeElPositionAndSize(topRef.current, {
          top: top - scrollY,
          width,
          left: -positionSize.left,
          display: 'block',
        });
        changeElPositionAndSize(leftRef.current, {
          left: left - scrollX,
          height,
          top: -positionSize.top,
          display: 'block',
        });
        changeElPositionAndSize(rightRef.current, {
          left: right - 1 - scrollX,
          height,
          top: -positionSize.top,
          display: 'block',
        });
        changeElPositionAndSize(bottomRef.current, {
          left: -positionSize.left,
          width,
          top: bottom - 1 - scrollY,
          display: 'block',
        });

        setPosition(
          [
            leftRef.current,
            rightRef.current,
            topRef.current,
            bottomRef.current,
          ],
          isModal,
        );
      } else {
        leftRef.current.style.display = 'none';
        rightRef.current.style.display = 'none';
        topRef.current.style.display = 'none';
        bottomRef.current.style.display = 'none';
      }
    };
    const unSubscribe = setSubscribe(renderGuideLines);

    contentWindow.addEventListener('scroll', renderGuideLines);
    return () => {
      unSubscribe();
      contentWindow.removeEventListener('scroll', renderGuideLines);
    };
  }, []);

  return (
    <>
      <div ref={leftRef} className={styles['guide-v']} />
      <div ref={rightRef} className={styles['guide-v']} />
      <div ref={topRef} className={styles['guide-h']} />
      <div ref={bottomRef} className={styles['guide-h']} />
    </>
  );
}

export default memo(forwardRef(Guidelines));
