import React, { memo, useCallback, useEffect, useRef } from 'react';
import styles from './index.less';
import {
  generateCSS,
  getElementInfo,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';

function GuidePlaceholder() {
  const hoverNodeRef = useRef<any>();
  const { getOperateState, setSubscribe, setOperateState } = useOperate(false);


  useEffect(() => {
    const renderGuidePlaceholder = () => {
      const { hoverNode, dropNode,selectedNode, isModal, isDropAble } = getOperateState();
      const node = dropNode || hoverNode;
      if (node&&node!==selectedNode) {
        const { left, top, width, height } = getElementInfo(node, isModal);
        hoverNodeRef.current.style.cssText = generateCSS(
          left,
          top,
          width,
          height,
        );
        hoverNodeRef.current.style.zIndex=1000;
        hoverNodeRef.current.style.display='block';

        if (dropNode) {
          if (isDropAble) {
            hoverNodeRef.current.style.borderColor = 'springgreen';
            hoverNodeRef.current.style.backgroundColor = 'rgba(0, 256, 0, 0.1)';
          } else {
            hoverNodeRef.current.style.borderColor = 'red';
            hoverNodeRef.current.style.backgroundColor = 'rgba(256, 0, 0, 0.1)';
          }
        }
        setPosition([hoverNodeRef.current], isModal);
      }else {

        hoverNodeRef.current.style.display='none';

      }
    };
    return setSubscribe(renderGuidePlaceholder);
  }, []);

  const onTransitionEnd = useCallback(() => {
    setOperateState({ isLock: false });
  }, []);

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      ref={hoverNodeRef}
      className={styles['hover-node']}
    />
  );
}

export default memo(GuidePlaceholder);
