import React, { memo } from 'react';
import styles from './index.less';
import { BrickPreviewPropsType } from '../BrickDesignLeft/BrickPreview';
import BrickDesignLeft from '../BrickDesignLeft';
import BrickDesignRight from '../BrickDesignRight';
import Styles from '../Styles';

export type BottomLeftButtonsType = BrickPreviewPropsType;

function BottomLeftButtons(props: BottomLeftButtonsType) {
  const { componentsCategory } = props;
  return (
    <div className={styles['bottom-left-bar']}>
      <BrickDesignLeft componentsCategory={componentsCategory} />
      <BrickDesignRight />
      <Styles />
    </div>
  );
}
export default memo(BottomLeftButtons);
