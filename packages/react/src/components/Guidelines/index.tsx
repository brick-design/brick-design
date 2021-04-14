import React, { memo, useEffect, useRef } from 'react';
import {
  DragSourceType,
  DropTargetType,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';
import { BrickStore } from '@brickd/hooks';
import styles from './index.less';
import { useSelector } from '../../hooks/useSelector';
import {
  changeElPositionAndSize,
  getElementInfo,
  getIframe,
  getScalePosition,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { OperateStateType } from '../OperateProvider';

type SelectState = {
  hoverKey: string | null;
  dropTarget: DropTargetType | null;
  selectedInfo: SelectedInfoType | null;
  dragSource: DragSourceType | null;
};

export type PositionSizeType = {
  width: number;
  height: number;
  top: number;
  left: number;
};

type GuidelinesType = {
  operateStore: BrickStore<OperateStateType>;
  scale: number;
};

function Guidelines(props: GuidelinesType) {
  const { operateStore, scale } = props;
  const topRef = useRef<any>();
  const bottomRef = useRef<any>();
  const leftRef = useRef<any>();
  const rightRef = useRef<any>();
  const iframe = useRef(getIframe()).current;
  const canvas = useRef(document.getElementById('brickd-canvas')).current;
  const canvasContainer = useRef(
    document.getElementById('brickd-canvas-container'),
  ).current;
  const { hoverKey } = useSelector<SelectState, STATE_PROPS>(['hoverKey']);

  const { getOperateState, setSubscribe } = useOperate(false, operateStore);
  const { dropNode } = getOperateState();

  useEffect(() => {
    const { contentWindow } = iframe;
    const renderGuideLines = () => {
      const { hoverNode, dropNode, isModal } = getOperateState();
      const node = dropNode || hoverNode;
      if (node) {
        const { left, top, bottom, right } = getElementInfo(
          node,
          iframe,
          isModal,
        );
        const { scrollY, scrollX } = contentWindow;
        const positionSize = getScalePosition(canvas, canvasContainer, scale);
        const { width, height } = positionSize;

        changeElPositionAndSize(topRef.current, {
          top: top - scrollY,
          width,
          left: -positionSize.left,
        });
        changeElPositionAndSize(leftRef.current, {
          left: left - scrollX,
          height,
          top: -positionSize.top,
        });
        changeElPositionAndSize(rightRef.current, {
          left: right - 1 - scrollX,
          height,
          top: -positionSize.top,
        });
        changeElPositionAndSize(bottomRef.current, {
          left: -positionSize.left,
          width,
          top: bottom - 1 - scrollY,
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
      }
      if (dropNode) {
        setTimeout(renderGuideLines, 100);
      }
    };
    const unSubscribe = setSubscribe(renderGuideLines);

    contentWindow.addEventListener('scroll', renderGuideLines);
    return () => {
      unSubscribe();
      contentWindow.removeEventListener('scroll', renderGuideLines);
    };
  }, [scale]);

  const guidControl = !dropNode && hoverKey;

  const guidH = guidControl ? styles['guide-h'] : styles['guide-hidden'];
  const guidV = guidControl ? styles['guide-v'] : styles['guide-hidden'];
  return (
    <>
      <div ref={leftRef} className={guidV} />
      <div ref={rightRef} className={guidV} />
      <div ref={topRef} className={guidH} />
      <div ref={bottomRef} className={guidH} />
    </>
  );
}

export default memo(Guidelines);
