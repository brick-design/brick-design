import React, { memo } from 'react';
import styles from './index.less';
import { BrickPreviewPropsType } from '../../Panels/Bricks/BrickPreview';
import Bricks from '../../Panels/Bricks';
import Scaffold from '../../Panels/Scaffold';
import Styles from '../../Panels/Styles';

export type BottomLeftButtonsType = BrickPreviewPropsType;

function BottomLeftButtons(props: BottomLeftButtonsType) {
  const { componentsCategory } = props;
  return (
    <div className={styles['bottom-left-bar']}>
      <Bricks componentsCategory={componentsCategory} />
      <Scaffold />
      <Styles />
    </div>
  );
}
export default memo(BottomLeftButtons);
