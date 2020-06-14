import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import configs from './configs';
import { SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import { getIframe } from '../../utils';
import { hoverClassTarget, selectClassTarget } from '../../common/constants';

type SelectState={
  selectedInfo:SelectedInfoType|null
}

const controlUpdate=(prevState:SelectState,nextState:SelectState)=>{
  const {selectedKey}=nextState.selectedInfo||{}
  const {selectedKey:prevSelectedKey}=prevState.selectedInfo||{}
  return prevSelectedKey!==selectedKey
}
export function ActionSheet() {
  const actionsRef=useRef<any>()
 const {selectedInfo}=useSelector<SelectState,STATE_PROPS>(['selectedInfo'],controlUpdate)
  useEffect(()=>{
    const {contentDocument}=getIframe()
    if(contentDocument&&actionsRef.current){
      const node= contentDocument.getElementsByClassName(selectClassTarget)[0]
      if(node){
        const {left,top}=node.getBoundingClientRect()
        actionsRef.current.style.top=`${top}px`
        actionsRef.current.style.left=`${left}px`
      }
    }
  },[selectedInfo])

    return (<div  className={selectedInfo?styles['container']:styles['guide-hidden']}  ref={actionsRef}>
        {configs.map((config,index)=>{
          const {icon,action}=config
          return (<div className={styles['action-btn']} onClick={action} key={index}>
            {icon}
          </div>)
        })}
      </div>)
}
