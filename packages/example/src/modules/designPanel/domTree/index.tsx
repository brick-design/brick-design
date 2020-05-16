import React, { useCallback } from 'react';
import SortTree from './SortTree';
import styles from './index.less';
import {clearHovered, ComponentConfigsType, useSelector} from '@/store';
import { onDragover, onDrop } from '@/modules/designPanel';

function DomTree() {
  const {componentConfigs}=useSelector<{componentConfigs:ComponentConfigsType}>(['componentConfigs'],(prevState,nextState)=>{
    const {componentConfigs:{root:prevRoot}}=prevState
    const {componentConfigs:{root}}=nextState
    if(!prevRoot&&root||prevRoot&&!root||prevRoot.componentName!==root.componentName) return true
    return false
  })
  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    clearHovered()
  }, []);

  if(!componentConfigs.root) return null

  return (
    <div onDrop={onDrop} onDragOver={onDragover} className={styles['sort-container']}>
      <div onMouseLeave={onMouseLeave} style={{ width: '100%' }}>
        <SortTree disabled
                  childNodes={['root']}
                  specialProps={{key:'root',domTreeKeys:[]}}
                  componentName={''}
        />
      </div>
    </div>
  );
}

export default DomTree;
