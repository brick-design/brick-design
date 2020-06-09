import React from 'react';
import styles from './index.less'
import configs from './configs'
import { SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
type selectState={
  selectedInfo:SelectedInfoType
}
export function ActionSheet() {
 const {selectedInfo}=useSelector<selectState,STATE_PROPS>(['selectedInfo'])
  if(!selectedInfo) return null
  return(
    <div className={styles['container']}>
      {configs.map((config,index)=>{
        const {icon,action}=config
        return <img src={icon} className={styles['']} onClick={action} key={index}/>
      })}
    </div>
  )
}
