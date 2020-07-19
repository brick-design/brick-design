import React, { useCallback,memo } from 'react';
import SortTree from './SortTree';
import styles from './index.less';
import { clearHovered, ComponentConfigsType, ROOT, STATE_PROPS, useSelector } from 'brickd-core';
import {onDrop,onDragover} from '../../common/events'

interface BrickTreeProps {
  className?:string
}

function BrickTree(props:BrickTreeProps) {
  const {componentConfigs}=useSelector<{componentConfigs:ComponentConfigsType},STATE_PROPS>(['componentConfigs'],
    (prevState,nextState)=>{
    const {componentConfigs:{[ROOT]:prevRoot}}=prevState
    const {componentConfigs:{[ROOT]:root}}=nextState
    return !!(!prevRoot && root);
  })
  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    clearHovered()
  }, []);

  if(!componentConfigs[ROOT]) return null
  const {className}=props
  return (
    <div
        onDrop={onDrop}
        onDragOver={onDragover}
        onMouseLeave={onMouseLeave}
         className={`${styles['sort-container']} ${className}`}>
        <SortTree disabled
                  childNodes={[ROOT]}
                  specialProps={{key:ROOT,domTreeKeys:[],parentKey:''}}
                  componentName={''}
        />
    </div>
  );
}


export default memo(BrickTree)
