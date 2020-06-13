import React, { useRef } from 'react';
import styles from './index.less';
import configs from './configs';
import { STATE_PROPS, useSelector } from 'brickd-core';

type selectState={
  hoverKey:string|null
}
export function ActionSheet() {
  const actionsRef=useRef<any>()
 const {hoverKey}=useSelector<selectState,STATE_PROPS>(['hoverKey'])
  if(!hoverKey) return null
  const iframe:any=document.getElementById('dnd-iframe')
  if(iframe) {
 const node= iframe.documentElement.getElementsByClassName('hover-outline')
   const {x,y,height,width,left,right,top,bottom}=node.getBoundingClientRect()
    actionsRef.current.style={
      top,
      left
    }

  }
    return (<div className={styles['container']}  ref={actionsRef}>
        {configs.map((config,index)=>{
          const {icon,action}=config
          return <div key={index}/>
        })}
      </div>
      )
}
