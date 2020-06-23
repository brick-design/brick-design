import React, { useEffect, useRef } from 'react';
import { getIframe } from '../../utils';
import { hoverClassTarget, selectClassTarget } from '../../common/constants';
import { DragSourceType, SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import styles from './index.less';
import each from 'lodash/each';

interface DistancesState {
  hoverKey: string | null,
  selectedInfo: SelectedInfoType | null,
  dragSource:DragSourceType|null
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
      leftGuide = left;
      rightGuide = right;
    } else if (rightDistance > 0 && rightDistance > selectWidth) {
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
  return result;

}

export function Distances() {
  const selectedNodeRef = useRef<ClientRect | null>();
  const topRef = useRef<any>();
  const bottomRef = useRef<any>();
  const leftRef = useRef<any>();
  const rightRef = useRef<any>();

  const { hoverKey, selectedInfo,dragSource } = useSelector<DistancesState, STATE_PROPS>(['hoverKey', 'selectedInfo','dragSource']);


  useEffect(() => {
    if (hoverKey && selectedInfo&&!dragSource) {
      const contentDocument = getIframe()!.contentDocument!;
      const hoverNode = contentDocument.getElementsByClassName(hoverClassTarget)[0];
      const selectNode = contentDocument.getElementsByClassName(selectClassTarget)[0];

      if (hoverNode && selectNode) {
        const selectRect = selectNode.getBoundingClientRect();
        const { left, top, width, height } = selectRect;
        const { leftGuide, leftDistance, rightDistance, rightGuide, topDistance, topGuide, bottomGuide, bottomDistance } = handleDistances(selectRect, hoverNode.getBoundingClientRect());

        if (leftDistance !== 0) {
          leftRef.current.style.width = `${leftDistance}px`;
          leftRef.current.style.left = `${leftGuide}px`;
          leftRef.current.style.top = `${top + height / 2}px`;
          leftRef.current.dataset.ditance = `${leftDistance}px`;
          leftRef.current.style.display = 'flex';
        } else {
          leftRef.current.style.display = 'none';

        }

        if (rightDistance !== 0) {
          rightRef.current.style.width = `${rightDistance}px`;
          rightRef.current.style.left = `${rightGuide}px`;
          rightRef.current.style.top = `${top + height / 2}px`;
          rightRef.current.dataset.ditance = `${rightDistance}px`;
          rightRef.current.style.display = 'flex';
        } else {
          rightRef.current.style.display = 'none';

        }


        if (topDistance !== 0) {
          topRef.current.style.height = `${topDistance}px`;
          topRef.current.style.left = `${left + width / 2}px`;
          topRef.current.style.top = `${topGuide}px`;
          topRef.current.dataset.ditance = `${topDistance}px`;
          topRef.current.style.display = 'flex';
        } else {
          topRef.current.style.display = 'none';

        }


        if (bottomDistance !== 0) {
          bottomRef.current.style.height = `${bottomDistance}px`;
          bottomRef.current.style.left = `${left + width / 2}px`;
          bottomRef.current.style.top = `${bottomGuide}px`;
          bottomRef.current.dataset.ditance = `${bottomDistance}px`;
          bottomRef.current.style.display = 'flex';
        } else {
          bottomRef.current.style.display = 'none';

        }


      }
    } else {
      leftRef.current.style.display = 'none';
      rightRef.current.style.display = 'none';
      topRef.current.style.display = 'none';
      bottomRef.current.style.display = 'none';

    }
  }, [hoverKey, selectedInfo,dragSource, selectedNodeRef, leftRef, rightRef, topRef, bottomRef]);
  return (<>
    <div ref={topRef} className={styles['distances-v']}/>
    <div ref={bottomRef} className={styles['distances-v']}/>
    <div ref={leftRef} className={styles['distances-h']}/>
    <div ref={rightRef} className={styles['distances-h']}/>
  </>);
}
