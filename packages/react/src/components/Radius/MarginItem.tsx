import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { STATE_PROPS } from '@brickd/core';
import styles from './index.less';
import { useOperate } from '../../hooks/useOperate';
import { css, firstToUpper, formatUnit } from '../../utils';
import { useSelector } from '../../hooks/useSelector';
import { MarginPosition, SelectState } from './index';

type MarginItemType = {
  position: MarginPosition;
};

const positionStyles: { [key: string]: React.CSSProperties } = {
  top: {
    top: '-4px',
  },
  right: {
    right: '-4px',
  },
  bottom: {
    bottom: '-4px',
  },
  left: {
    left: '-4px',
  },
};
const positionMap = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};
function MarginItem(props: MarginItemType) {
  const { position } = props;
  const marginRef = useRef<HTMLDivElement>();
  const { selectedInfo } = useSelector<SelectState, STATE_PROPS>([
    'selectedInfo',
  ]);
  const { selectedKey } = selectedInfo || {};

  const [checked, setChecked] = useState(!['left', 'top'].includes(position));
  const {
    setOperateState,
    getOperateState,
    setSubscribe,
    executeKeyListener,
  } = useOperate();
  const lockedMargin =
    position === 'left' || position === 'right'
      ? 'lockedMarginLeft'
      : 'lockedMarginTop';
  const marginPosition = `margin${firstToUpper(position)}`;
  const changeChecked = () => setChecked(!checked);
  const initMargin = useCallback(() => {
    const { selectedNode } = getOperateState();
    if (selectedNode) {
      const elCss = css(selectedNode);
      marginRef.current.dataset.content =
        marginPosition + ':' + formatUnit(elCss[marginPosition] || 0);
    }
  }, []);

  useEffect(() => {
    const unKeySubscribe = setSubscribe(
      changeChecked,
      'lockedMargin' + position,
    );
    const unSubscribe = setSubscribe(initMargin);
    return () => {
      unKeySubscribe();
      unSubscribe();
    };
  });

  const onClick = () => {
    setChecked(!checked);
    const operateState = getOperateState();
    executeKeyListener('lockedMargin' + positionMap[position]);
    setOperateState({ [lockedMargin]: !operateState[lockedMargin] });
  };

  return (
    <div
      ref={marginRef}
      onClick={onClick}
      style={positionStyles[position]}
      className={
        selectedKey
          ? `${styles['margin-selector-item']} ${
              checked && styles['margin-checked']
            }`
          : styles['guide-hidden']
      }
    />
  );
}

export default memo(MarginItem);
