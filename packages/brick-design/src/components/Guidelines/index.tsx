import React, { useEffect,useRef } from 'react';
import styles from './index.less'
import { DragSourceType, DropTargetType, SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import { getIframe } from '../../utils';
import { hoverClassTarget } from '../../common/constants';
type SelectState={
  hoverKey:string|null,
  dropTarget:DropTargetType|null,
  selectedInfo:SelectedInfoType|null,
  dragSource:DragSourceType|null
}

const controlUpdate=(prevState:SelectState,nextState:SelectState)=>{
  return true
}
export function Guidelines() {
  const topRef=useRef<any>()
  const bottomRef=useRef<any>()
  const leftRef=useRef<any>()
  const rightRef=useRef<any>()
  const hoverNodeRef=useRef<any>()

  const {hoverKey,dropTarget,dragSource,selectedInfo}=useSelector<SelectState,STATE_PROPS>(['hoverKey','dropTarget','dragSource','selectedInfo'],controlUpdate)
  useEffect(()=>{
    if(selectedInfo&&dragSource) return
    const contentDocument=getIframe()!.contentDocument!
    if(contentDocument&&topRef.current&&hoverKey){
      const node= contentDocument.getElementsByClassName(hoverClassTarget)[0]
      if(node){
        const {left,top,bottom,right,width,height}=node.getBoundingClientRect()
        hoverNodeRef.current.style.left=`${left}px`
        hoverNodeRef.current.style.top=`${top}px`
        hoverNodeRef.current.style.width=`${width}px`
        hoverNodeRef.current.style.height=`${height}px`
        topRef.current.style.top=`${top}px`
        leftRef.current.style.left=`${left}px`
        rightRef.current.style.left=`${right-1}px`
        bottomRef.current.style.top=`${bottom-1}px`
      }
    }
  },[hoverKey,dragSource,selectedInfo])
  const guidControl=hoverKey&&(!selectedInfo||selectedInfo&&!dragSource)
  const guidH=guidControl?styles['guide-h']:styles['guide-hidden']
  const guidV=guidControl?styles['guide-v']:styles['guide-hidden']
  const hoverNode=guidControl?dropTarget?styles['drop-node']:styles['hover-node']:styles['guide-hidden']
  return(<>
    <div ref={hoverNodeRef} className={hoverNode}/>
    <div ref={leftRef} className={guidV}/>
    <div ref={rightRef} className={guidV}/>
    <div ref={topRef} className={guidH}/>
    <div ref={bottomRef} className={guidH}/>
    </>)
}
