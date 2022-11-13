import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { freeGuideLinesStore, generateCSS, getElementInfo } from '../../utils';
import { useOperate } from '../../hooks/useOperate';

export function FreeGuidelines(props) {
  const { lineStyle = {} } = props;
  const [{ vLines, hLines }, setState] = useState({ vLines: [], hLines: [] });
  const {getOperateState}=useOperate();
  const containerRef = useRef<HTMLDivElement>();


  const showDragLine=useCallback((isShow:boolean)=>{
  	const {selectedNode}=getOperateState();
  	if(selectedNode&&isShow){
      const { left, top, width, height }=getElementInfo(selectedNode.parentElement);

			containerRef.current.style.cssText=generateCSS(
        left,
        top,
        width,
        height,
      );
			containerRef.current.style.zIndex='1000';
    }else {
			containerRef.current.style.zIndex='-1';
		}

	},[]);


  useEffect(() => {
    freeGuideLinesStore.renderGuideLines = setState;
    freeGuideLinesStore.showDragLine=showDragLine;
  });

  return (
    <div className={styles['free-container']} ref={containerRef}>
      {vLines.map(({ length, value, origin }, i) => (
        <span
          className={styles['line']}
          key={`v-${i}`}
          style={{
            left: value,
            top: origin,
            height: length,
            width: 1,
            ...lineStyle,
          }}
        />
      ))}
      {hLines.map(({ length, value, origin }, i) => (
        <span
					className={styles['line']}
          key={`h-${i}`}
          style={{
            top: value,
            left: origin,
            width: length,
            height: 1,
            ...lineStyle,
          }}
        />
      ))}
    </div>
  );
}
