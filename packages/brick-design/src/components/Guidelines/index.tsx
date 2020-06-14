import React, { useEffect,useRef } from 'react';
import styles from './index.less'
import { STATE_PROPS, useSelector } from 'brickd-core';
import { getIframe } from '../../utils';
import { hoverClassTarget } from '../../common/constants';
type SelectState={
  hoverKey:string|null
}

const controlUpdate=(prevState:SelectState,nextState:SelectState)=>{
  return prevState.hoverKey!==nextState.hoverKey
}
export function Guidelines() {
  const topRef=useRef<any>()
  const bottomRef=useRef<any>()
  const leftRef=useRef<any>()
  const rightRef=useRef<any>()

  const {hoverKey}=useSelector<SelectState,STATE_PROPS>(['hoverKey'],controlUpdate)
  useEffect(()=>{
    const {contentDocument}=getIframe()
    if(contentDocument&&topRef.current&&hoverKey){
      const node= contentDocument.getElementsByClassName(hoverClassTarget)[0]
      if(node){
        const {left,top,bottom,right}=node.getBoundingClientRect()
        topRef.current.style.top=`${top}px`
        leftRef.current.style.left=`${left}px`
        rightRef.current.style.left=`${right-1}px`
        bottomRef.current.style.top=`${bottom-1}px`
      }
    }
  },[hoverKey])

  return(<>
    <div ref={leftRef} className={hoverKey?styles['guide-v']:styles['guide-hidden']}/>
    <div ref={rightRef} className={hoverKey?styles['guide-v']:styles['guide-hidden']}/>
    <div ref={topRef} className={hoverKey?styles['guide-h']:styles['guide-hidden']}/>
    <div ref={bottomRef} className={hoverKey?styles['guide-h']:styles['guide-hidden']}/>
    </>)
}
