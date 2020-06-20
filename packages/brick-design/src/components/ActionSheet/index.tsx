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

    return (<div  className={styles['container']} style={{top:isOut?-20:0}}>
        {configs.map((config,index)=>{
          const {icon,action}=config
          if(isRoot&&icon!==ACTIONS.delete) return null
          if(!hasChildNodes&&icon===ACTIONS.clear) return null
          return (<div className={styles['action-btn']} onClick={action} key={icon}>
            {icon}
          </div>)
        })}
      </div>)
}
