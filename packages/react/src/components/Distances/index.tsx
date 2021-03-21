import React, { memo, useEffect, useRef } from 'react';

import { each } from 'lodash';
import styles from './index.less';
import {
  generateCSS, getDragKey,
  getElementInfo,
  getIframe,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';

function handleDistances(selectRect: ClientRect, hoverRect: ClientRect) {
  const {
    left: selectLeft,
    top: selectTop,
    bottom: selectBottom,
    right: selectRight,
    width: selectWidth,
    height: selectHeight,
  } = selectRect;
  const { left, top, bottom, right, width, height } = hoverRect;
  let leftDistance = 0;
  let leftGuide = 0;
  let rightDistance = 0;
  let rightGuide = 0;
  let topDistance = 0;
  let topGuide = 0;
  let bottomDistance = 0;
  let bottomGuide = 0;

  leftDistance = selectLeft - left;
  rightDistance = selectRight - right;
  topDistance = selectTop - top;
  bottomDistance = selectBottom - bottom;
  //select组件左右边框在hover组件内部

  if (width > selectWidth) {
    if (leftDistance == 0) {
      rightGuide = selectRight;
    } else if (rightDistance === 0) {
      leftGuide = left;
    } else if (leftDistance > 0 && rightDistance < 0) {
      leftGuide = left;
      rightGuide = selectRight;
    } else if (leftDistance < 0 && Math.abs(leftDistance) < selectWidth) {
      //select组件右侧出hover组件
      leftGuide = selectLeft;
      rightGuide = selectRight;
    } else if (leftDistance < 0 && Math.abs(leftDistance) > selectWidth) {
      //select组件
      leftDistance = 0;
      rightDistance = left - selectRight;
      rightGuide = selectRight;
    } else if (rightDistance > 0 && rightDistance < selectWidth) {
      //select组件左侧出hover组件
      leftGuide = left;
      rightGuide = right;
    } else if (rightDistance > 0 && rightDistance > selectWidth) {
      rightDistance = 0;
      leftDistance = selectLeft - right;
      leftGuide = right;
    } else if (
      Math.abs(leftDistance) === selectWidth ||
      rightDistance === selectWidth
    ) {
      leftDistance = 0;
      rightDistance = 0;
    }
  } else {
    if (leftDistance == 0) {
      rightGuide = right;
    } else if (rightDistance === 0) {
      leftGuide = selectLeft;
    } else if (leftDistance < 0 && rightDistance > 0) {
      leftGuide = selectLeft;
      rightGuide = right;
    } else if (leftDistance > 0 && leftDistance < width) {
      leftGuide = left;
      rightGuide = right;
    } else if (leftDistance > 0 && leftDistance > width) {
      rightDistance = 0;
      leftDistance = selectLeft - right;
      leftGuide = right;
    } else if (rightDistance < 0 && Math.abs(rightDistance) < width) {
      leftGuide = selectLeft;
      rightGuide = selectRight;
    } else if (rightDistance < 0 && Math.abs(rightDistance) > width) {
      leftDistance = 0;
      rightDistance = selectRight - left;
      rightGuide = selectRight;
    } else if (leftDistance === width || Math.abs(rightDistance) === width) {
      rightDistance = 0;
      leftDistance = 0;
    }
  }

  if (height > selectHeight) {
    if (topDistance === 0) {
      bottomGuide = selectBottom;
    } else if (bottomDistance === 0) {
      topGuide = top;
    } else if (topDistance > 0 && bottomDistance < 0) {
      topGuide = top;
      bottomGuide = selectBottom;
    } else if (topDistance < 0 && Math.abs(topDistance) < selectHeight) {
      topGuide = selectTop;
      bottomGuide = selectBottom;
    } else if (topDistance < 0 && Math.abs(topDistance) > selectHeight) {
      topDistance = 0;
      bottomDistance = selectBottom - top;
      bottomGuide = selectBottom;
    } else if (bottomDistance > 0 && bottomDistance < selectHeight) {
      topGuide = top;
      bottomGuide = bottom;
    } else if (bottomDistance > 0 && bottomDistance > selectHeight) {
      bottomDistance = 0;
      topDistance = selectTop - bottom;
      topGuide = bottom;
    } else if (
      Math.abs(topDistance) === selectHeight ||
      bottomDistance === selectHeight
    ) {
      bottomDistance = 0;
      topDistance = 0;
    }
  } else {
    if (topDistance === 0) {
      bottomGuide = bottom;
    } else if (bottomDistance === 0) {
      topGuide = selectTop;
    } else if (topDistance < 0 && bottomDistance > 0) {
      topGuide = selectTop;
      bottomGuide = bottom;
    } else if (topDistance > 0 && topDistance < height) {
      topGuide = top;
      bottomGuide = bottom;
    } else if (topDistance > 0 && topDistance > height) {
      bottomDistance = 0;
      topDistance = selectTop - bottom;
      topGuide = bottom;
    } else if (bottomDistance < 0 && Math.abs(bottomDistance) < height) {
      topGuide = selectTop;
      bottomGuide = selectBottom;
    } else if (bottomDistance < 0 && Math.abs(bottomDistance) > height) {
      topDistance = 0;
      bottomDistance = selectBottom - top;
      bottomGuide = selectBottom;
    } else if (topDistance === height || Math.abs(bottomDistance) === height) {
      bottomDistance = 0;
      topDistance = 0;
    }
  }

  const result: any = {};
  each(
    {
      leftGuide,
      leftDistance,
      rightDistance,
      rightGuide,
      topDistance,
      topGuide,
      bottomGuide,
      bottomDistance,
    },
    (v, k) => (result[k] = Math.round(Math.abs(v))),
  );
  return result;
}

function Distances() {
  const topRef = useRef<any>();
  const bottomRef = useRef<any>();
  const leftRef = useRef<any>();
  const rightRef = useRef<any>();
  const iframe = getIframe();

  const { getOperateState, setSubscribe } = useOperate();

  useEffect(() => {
    const renderDistances = () => {
      const { selectedNode, hoverNode, isModal } = getOperateState();
      if (hoverNode && selectedNode&&!getDragKey()) {
        const selectRect: ClientRect = getElementInfo(
          selectedNode,
          iframe,
          isModal,
        );
        const { width, height, top, left } = selectRect;
        const hoverRect: ClientRect = getElementInfo(
          hoverNode,
          iframe,
          isModal,
        );
        const {
          leftGuide,
          leftDistance,
          rightDistance,
          rightGuide,
          topDistance,
          topGuide,
          bottomGuide,
          bottomDistance,
        } = handleDistances(selectRect, hoverRect);

        if (leftDistance !== 0) {
          leftRef.current.style.cssText = generateCSS(
            leftGuide,
            top + height / 2,
            leftDistance,
          );
          leftRef.current.dataset.distance = `${leftDistance}px`;
        } else {
          leftRef.current.style.display = 'none';
        }

        if (rightDistance !== 0) {
          rightRef.current.style.cssText = generateCSS(
            rightGuide,
            top + height / 2,
            rightDistance,
          );
          rightRef.current.dataset.distance = `${rightDistance}px`;
        } else {
          rightRef.current.style.display = 'none';
        }

        if (topDistance !== 0) {
          topRef.current.style.cssText = generateCSS(
            left + width / 2,
            topGuide,
            undefined,
            topDistance,
          );
          topRef.current.dataset.distance = `${topDistance}px`;
        } else {
          topRef.current.style.display = 'none';
        }

        if (bottomDistance !== 0) {
          bottomRef.current.style.cssText = generateCSS(
            left + width / 2,
            bottomGuide,
            undefined,
            bottomDistance,
          );
          bottomRef.current.dataset.distance = `${bottomDistance}px`;
        } else {
          bottomRef.current.style.display = 'none';
        }
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

    const unSubscribe = setSubscribe(renderDistances);
    return unSubscribe;
  }, [leftRef.current, rightRef.current, topRef.current, bottomRef.current]);

  return (
    <>
      <div ref={topRef} className={styles['distances-v']} />
      <div ref={bottomRef} className={styles['distances-v']} />
      <div ref={leftRef} className={styles['distances-h']} />
      <div ref={rightRef} className={styles['distances-h']} />
    </>
  );
}

export default memo(Distances);
