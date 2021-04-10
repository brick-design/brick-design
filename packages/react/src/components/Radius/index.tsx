import React, { memo, useCallback, useEffect, useRef } from 'react';
import {

  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';
import { map } from 'lodash';
import styles from './index.less';
import { RadiusItem } from './RadiusItem';
import { useSelector } from '../../hooks/useSelector';
import {
  generateCSS,
  getElementInfo,
  getIframe,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';

type SelectState = {
  selectedInfo: SelectedInfoType | null;
};

export enum Radius {
  topLeft = 'borderTopLeftRadius',
  topRight = 'borderTopRightRadius',
  bottomLeft = 'borderBottomLeftRadius',
  bottomRight = 'borderBottomRightRadius',
}



function RadiusPanel() {
  const hoverNodeRef = useRef<any>();
  const iframe = useRef(getIframe()).current;
  const { selectedInfo } = useSelector<
    SelectState,
    STATE_PROPS
  >(['selectedInfo']);

  const { getOperateState, setSubscribe } = useOperate(false);
  const { selectedKey } = selectedInfo || {};

  const positionPanel = useCallback(() => {
    const { selectedNode, isModal } = getOperateState();
    if (selectedNode) {
      const { left, top, width, height } = getElementInfo(
        selectedNode,
        iframe,
        isModal,
      );
      hoverNodeRef.current.style.cssText =
        generateCSS(left, top, width, height);
    }

  },[]);

  useEffect(() => {
    const { contentWindow } = iframe;
    const unSubscribe = setSubscribe(positionPanel);
    contentWindow.addEventListener('scroll', positionPanel);
    return () => {
      unSubscribe();
      contentWindow.removeEventListener('scroll', positionPanel);
    };
  }, []);



  return (
      <div
        ref={hoverNodeRef}
        className={selectedKey?styles['brickd-radius-container']:styles['guide-hidden']}
      >
        {map(Radius, (radius) => (
          <RadiusItem
            radius={radius}
            key={radius}
          />
        ))}
      </div>
  );
}

export default memo(RadiusPanel);
