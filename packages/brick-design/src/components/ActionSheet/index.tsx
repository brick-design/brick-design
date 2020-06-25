import React from 'react';
import styles from './index.less';
import configs, { ACTIONS } from './configs';

interface ActionSheetProps {
  hasChildNodes:boolean,
  isRoot:boolean
}
export function ActionSheet(props:ActionSheetProps) {
  const {isRoot,hasChildNodes}=props

    return (<div  className={styles['container']} style={{top:-13}}>
        {configs.map((config,index)=>{
          const {icon,action,type}=config
          if(isRoot&&type!==ACTIONS.delete) return null
          if(!hasChildNodes&&type===ACTIONS.clear) return null
          return (<div className={styles['action-btn']} onClick={action} key={type}>
            <img src={icon} className={styles['action-icon']}/>
          </div>)
        })}
      </div>)
}
