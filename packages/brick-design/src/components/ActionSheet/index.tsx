import React from 'react';
import styles from './index.less';
import configs, { ACTIONS } from './configs';

interface ActionSheetProps {
  isOut:boolean,
  hasChildNodes:boolean,
  isRoot:boolean
}
export function ActionSheet(props:ActionSheetProps) {
  const {isOut,isRoot,hasChildNodes}=props

    return (<div  className={styles['container']} style={{top:isOut?-13:0}}>
        {configs.map((config,index)=>{
          const {icon,action,type}=config
          if(isRoot&&icon!==ACTIONS.delete) return null
          if(!hasChildNodes&&type===ACTIONS.clear) return null
          return (<div className={styles['action-btn']} onClick={action} key={type}>
            <img src={icon} className={styles['action-icon']}/>
          </div>)
        })}
      </div>)
}
