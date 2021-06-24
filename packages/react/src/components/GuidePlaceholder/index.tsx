import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
 getDropTarget,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';
import { get } from 'lodash';
import styles from './index.less';
import { useSelector } from '../../hooks/useSelector';
import {
  generateCSS,
  getElementInfo,
  getIframe,
  getSelectedNode,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';

type SelectState = {
  hoverKey: string | null;
  selectedInfo: SelectedInfoType | null;
};

function getNode(key: string) {
  const selectedNode = getSelectedNode(`${key}-0`);
  if (selectedNode) {
    const { contentWindow } = getIframe();
    const { innerWidth, innerHeight } = contentWindow;
    const { x, y } = selectedNode.getBoundingClientRect();
    const position: { left?: number; top?: number } = {};
    if (y > innerHeight) {
      position.top = y - 50;
    } else if (y < 0) {
      position.top = y - 50;
    } else if (x > innerWidth) {
      position.left = innerWidth + x;
    } else if (x < 0) {
      position.left = x;
    }
    contentWindow.scrollBy({ ...position, behavior: 'smooth' });
  }

  return selectedNode;
}

function GuidePlaceholder() {
  const hoverNodeRef = useRef<any>();

  const { hoverKey, selectedInfo } = useSelector<
    SelectState,
    STATE_PROPS
  >(['hoverKey','selectedInfo']);

  const { getOperateState, setSubscribe, setOperateState } = useOperate(false);
  const { selectedKey } = selectedInfo || {};
  const dropKey = get(getDropTarget, 'dropKey');
  const { operateHoverKey, operateSelectedKey } = getOperateState();

  if (!dropKey && hoverKey !== operateHoverKey) {
    const hoverNode = getNode(hoverKey);
    setOperateState({ hoverNode, operateHoverKey: hoverKey });
  }

  if (selectedKey !== operateSelectedKey) {
    const selectedNode = getNode(selectedKey);
    setOperateState({ selectedNode, operateSelectedKey: selectedKey });
  }

  useEffect(() => {
    const renderGuidePlaceholder = () => {
      const { hoverNode, dropNode, isModal, isDropAble } = getOperateState();
      const node = dropNode || hoverNode;
      if (node) {
        const { left, top, width, height } = getElementInfo(node, isModal);
        hoverNodeRef.current.style.cssText = generateCSS(
          left,
          top,
          width,
          height,
        );
        hoverNodeRef.current.style.zIndex=1000;
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
        hoverNodeRef.current.style.zIndex=-1;

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
