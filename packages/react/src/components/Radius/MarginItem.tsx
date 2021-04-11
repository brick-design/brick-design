import React, { memo, useState } from 'react';
import styles from './index.less';
import { MarginPosition } from './index';

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

function MarginItem(props: MarginItemType) {
  const { position } = props;
  const [checked, setChecked] = useState(false);
  return (
    <div
      data-content={checked ? `locked:${position}` : `unlocked:${position}`}
      onClick={() => setChecked(!checked)}
      style={positionStyles[position]}
      className={`${styles['margin-selector-item']} ${
        checked && styles['margin-checked']
      }`}
    />
  );
}

export default memo(MarginItem);
