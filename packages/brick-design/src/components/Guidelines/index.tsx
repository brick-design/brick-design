import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { DragSourceType, DropTargetType, SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import { generateCSS, getElementInfo, getIframe, getSelectedNode } from '../../utils';

type SelectState = {
  hoverKey: string | null,
  dropTarget: DropTargetType | null,
  selectedInfo: SelectedInfoType | null,
  dragSource: DragSourceType | null
}

const controlUpdate = (prevState: SelectState, nextState: SelectState) => {
  return true;
};

export function Guidelines() {
  const topRef = useRef<any>();
  const bottomRef = useRef<any>();
  const leftRef = useRef<any>();
  const rightRef = useRef<any>();
  const hoverNodeRef = useRef<any>();

  const iframe=getIframe()
  const { hoverKey, dropTarget, dragSource, selectedInfo } = useSelector<SelectState, STATE_PROPS>(['hoverKey', 'dropTarget', 'dragSource', 'selectedInfo'], controlUpdate);
  const guidControl = hoverKey && (!selectedInfo || selectedInfo && !dragSource);
  const node = getSelectedNode(hoverKey!, iframe);
  if (guidControl && node) {
    const { left, top, bottom, right, width, height } = getElementInfo(node);
    const { contentDocument } = iframe!;

    hoverNodeRef.current.style.cssText = generateCSS(left, top, width, height);
    topRef.current.style.top = `${top}px`;
    topRef.current.style.width=`${contentDocument!.body.scrollWidth}px`
    leftRef.current.style.left = `${left }px`;
    leftRef.current.style.height=`${contentDocument!.body.scrollHeight}px`
    rightRef.current.style.left = `${right - 1 }px`;
    rightRef.current.style.height=`${contentDocument!.body.scrollHeight}px`
    bottomRef.current.style.top = `${bottom - 1 }px`;
    bottomRef.current.style.width=`${contentDocument!.body.scrollWidth}px`

  }
  const guidH = guidControl ? styles['guide-h'] : styles['guide-hidden'];
  const guidV = guidControl ? styles['guide-v'] : styles['guide-hidden'];
  const hoverNode = guidControl ? dropTarget ? styles['drop-node'] : styles['hover-node'] : styles['guide-hidden'];
  return (<>
    <div ref={hoverNodeRef} className={hoverNode}/>
    <div ref={leftRef} className={guidV}/>
    <div ref={rightRef} className={guidV}/>
    <div ref={topRef} className={guidH}/>
    <div ref={bottomRef} className={guidH}/>
  </>);
}
