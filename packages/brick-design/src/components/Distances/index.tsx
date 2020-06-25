import React, { useMemo, useRef } from 'react';
import { generateCSS, getIframe, getSelectedNode } from '../../utils';
import { DragSourceType, SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import styles from './index.less';
import each from 'lodash/each';

interface DistancesState {
  hoverKey: string | null,
  selectedInfo: SelectedInfoType | null,
  dragSource: DragSourceType | null
}

function handleDistances(selectRect: ClientRect, hoverRect: ClientRect) {
  const { left: selectLeft, top: selectTop, bottom: selectBottom, right: selectRight, width: selectWidth, height: selectHeight } = selectRect;
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
  let leftSubtract = false;
  let rightSubtract=false
  if (width > selectWidth) {
    if (leftDistance == 0) {
      rightGuide = selectRight;
    } else if (rightDistance === 0) {
      leftGuide = left;
    } else if (leftDistance > 0 && rightDistance < 0) {
      leftGuide = left;
      rightGuide = selectRight;
    } else if (leftDistance < 0 && Math.abs(leftDistance) < selectWidth) {  //select组件右侧出hover组件
      leftGuide = selectLeft;
      rightGuide = selectRight;
    } else if (leftDistance < 0 && Math.abs(leftDistance) > selectWidth) { //select组件
      leftDistance = 0;
      rightDistance = left - selectRight;
      rightGuide = selectRight;
    } else if (rightDistance > 0 && rightDistance < selectWidth) {  //select组件左侧出hover组件
      leftSubtract=true;
      rightSubtract=true
      leftGuide = left;
      rightGuide = right;
    } else if (rightDistance > 0 && rightDistance > selectWidth) {
      rightSubtract=true
      rightDistance = 0;
      leftDistance = selectLeft - right;
      leftGuide = right;
    } else if (Math.abs(leftDistance) === selectWidth || rightDistance === selectWidth) {
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

  const topSubtract = false;
  const bottomSubtract=false
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
    } else if (Math.abs(topDistance) === selectHeight || bottomDistance === selectHeight) {
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
  each({
    leftGuide,
    leftDistance,
    rightDistance,
    rightGuide,
    topDistance,
    topGuide,
    bottomGuide,
    bottomDistance,
  }, (v, k) => result[k] = Math.round(Math.abs(v)));
  return { ...result, topSubtract, leftSubtract,rightSubtract,bottomSubtract };

}


export function Distances() {
  const topRef = useRef<any>();
  const bottomRef = useRef<any>();
  const leftRef = useRef<any>();
  const rightRef = useRef<any>();
  const iframe=getIframe()

  const { hoverKey, selectedInfo, dragSource } = useSelector<DistancesState, STATE_PROPS>(['hoverKey', 'selectedInfo', 'dragSource']);
  const { selectedKey } = selectedInfo || {};
  const hoverNode = getSelectedNode(hoverKey, iframe);
  const selectNode = useMemo(() => getSelectedNode(selectedKey, iframe), [selectedKey, iframe]);

  if (!dragSource && hoverNode && selectNode) {
    const selectRect = selectNode.getBoundingClientRect();
    const { left, top, width, height } = selectRect;
    const { leftGuide, leftDistance, rightDistance, rightGuide, topDistance, topGuide, bottomGuide, bottomDistance, topSubtract, leftSubtract,rightSubtract,bottomSubtract } = handleDistances(selectRect, hoverNode.getBoundingClientRect());
    if (leftDistance !== 0) {
      leftRef.current.style.cssText = generateCSS(leftGuide, top + height / 2, leftDistance, undefined, iframe, leftSubtract);
      leftRef.current.dataset.distance = `${leftDistance}px`;
    } else {
      leftRef.current.style.display = 'none';

    }

    if (rightDistance !== 0) {
      rightRef.current.style.cssText = generateCSS(rightGuide, top + height / 2, rightDistance, undefined, iframe, rightSubtract);
      rightRef.current.dataset.distance = `${rightDistance}px`;
    } else {
      rightRef.current.style.display = 'none';

    }


    if (topDistance !== 0) {
      topRef.current.style.cssText = generateCSS(left + width / 2, topGuide, undefined, topDistance,iframe,topSubtract);
      topRef.current.dataset.distance = `${topDistance}px`;
    } else {
      topRef.current.style.display = 'none';

    }


    if (bottomDistance !== 0) {
      bottomRef.current.style.cssText = generateCSS(left + width / 2, bottomGuide, undefined, bottomDistance,iframe,bottomSubtract);
      bottomRef.current.dataset.distance = `${bottomDistance}px`;
    } else {
      bottomRef.current.style.display = 'none';
    }
  } else if (leftRef.current) {
    leftRef.current.style.display = 'none';
    rightRef.current.style.display = 'none';
    topRef.current.style.display = 'none';
    bottomRef.current.style.display = 'none';
  }


  return (<>
    <div ref={topRef} className={styles['distances-v']}/>
    <div ref={bottomRef} className={styles['distances-v']}/>
    <div ref={leftRef} className={styles['distances-h']}/>
    <div ref={rightRef} className={styles['distances-h']}/>
  </>);
}
