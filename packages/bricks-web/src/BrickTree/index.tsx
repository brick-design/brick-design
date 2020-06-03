import React, { useCallback } from 'react';
import SortTree from './SortTree';
import styles from './index.less';
import { clearHovered, ComponentConfigsType, useSelector } from 'brickd-core';
import { onDragover, onDrop } from 'brickd';

interface BrickTreeProps {
  className?:string
}
export function BrickTree(props:BrickTreeProps) {
  const {componentConfigs}=useSelector<{componentConfigs:ComponentConfigsType}>(['componentConfigs'],(prevState,nextState)=>{
    const {componentConfigs:{root:prevRoot}}=prevState
    const {componentConfigs:{root}}=nextState
    return !!(!prevRoot && root);

  })
  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    clearHovered()
  }, []);

  if(!componentConfigs.root) return null
  const {className}=props
  return (
    <div
        onDrop={onDrop}
         onDragOver={onDragover}
        onMouseLeave={onMouseLeave}
         className={`${styles['sort-container']} ${className}`}>
        <SortTree disabled
                  childNodes={['root']}
                  specialProps={{key:'root',domTreeKeys:[],parentKey:''}}
                  componentName={''}
        />
    </div>
  );
}

