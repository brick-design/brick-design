import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  DragSourceType,
  DropTargetType,
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
  dropTarget: DropTargetType | null;
  selectedInfo: SelectedInfoType | null;
  dragSource: DragSourceType | null;
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

  const { hoverKey, dropTarget, selectedInfo } = useSelector<
    SelectState,
    STATE_PROPS
  >(['hoverKey', 'dropTarget', 'selectedInfo']);

  const { getOperateState, setSubscribe, setOperateState } = useOperate(false);
  const { selectedKey } = selectedInfo || {};
  const dropKey = get(dropTarget, 'selectedKey');
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
    const renderGuideLines = () => {
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
      }
      if (dropNode) {
        setTimeout(renderGuideLines, 100);
      }
    };
    const unSubscribe = setSubscribe(renderGuideLines);
    return () => {
      unSubscribe();
    };
  }, []);

  const onTransitionEnd = useCallback(() => {
    setOperateState({ isLock: false });
  }, []);
  const hoverNodeClass =
    dropKey || hoverKey
      ? dropKey
        ? styles['drop-node']
        : styles['hover-node']
      : styles['guide-hidden'];
  return (
    <div
      onTransitionEnd={onTransitionEnd}
      ref={hoverNodeRef}
      className={hoverNodeClass}
    />
  );
}

export default memo(GuidePlaceholder);
