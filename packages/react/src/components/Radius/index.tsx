import React, { memo, useCallback, useEffect, useRef } from 'react';
import { SelectedInfoType, STATE_PROPS } from '@brickd/core';
import { map } from 'lodash';
import styles from './index.less';
import RadiusItem from './RadiusItem';
import MarginItem from './MarginItem';
import { useSelector } from '../../hooks/useSelector';
import { useOperate } from '../../hooks/useOperate';
import { generateCSS } from '../../utils';

type SelectState = {
  selectedInfo: SelectedInfoType | null;
};

export enum Radius {
  topLeft = 'borderTopLeftRadius',
  topRight = 'borderTopRightRadius',
  bottomLeft = 'borderBottomLeftRadius',
  bottomRight = 'borderBottomRightRadius',
}

export enum MarginPosition {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
}

function RadiusPanel() {
  const hoverNodeRef = useRef<any>();
  const { selectedInfo } = useSelector<SelectState, STATE_PROPS>([
    'selectedInfo',
  ]);

  const { setOperateState } = useOperate(false);
  const { selectedKey } = selectedInfo || {};

  const radiusChangePosition = useCallback(
    (
      left?: number,
      top?: number,
      width?: number,
      height?: number,
      css?: string,
    ) => {
      hoverNodeRef.current.style.cssText =
        generateCSS(left, top, width, height) + css;
    },
    [],
  );

  useEffect(() => {
    setOperateState({ radiusChangePosition });
  }, []);

  return (
    <div
      ref={hoverNodeRef}
      className={
        selectedKey ? styles['brickd-radius-container'] : styles['guide-hidden']
      }
    >
      {map(Radius, (radius) => (
        <RadiusItem radius={radius} key={radius} />
      ))}
      {map(MarginPosition, (p) => (
        <MarginItem position={p} />
      ))}
    </div>
  );
}

export default memo(RadiusPanel);
