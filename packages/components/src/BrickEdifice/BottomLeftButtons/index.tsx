import React, { memo } from 'react';
import styles from './index.less';
import { BrickPreviewPropsType } from '../../Panels/Bricks/BrickPreview';
import Bricks from '../../Panels/Bricks';
import Scaffold from '../../Panels/Scaffold';
import Styles from '../../Panels/Styles';
import { ButtonWrapper } from '../../Abilities';

export type BottomLeftButtonsType = BrickPreviewPropsType;

function BottomLeftButtons(props: BottomLeftButtonsType) {
  const { componentsCategory } = props;
  const PANEL_KEYS=['Bricks','Scaffold','Styles'];

  return (
    <ButtonWrapper panelKeys={PANEL_KEYS} className={styles['bottom-left-bar']}>
      <Bricks componentsCategory={componentsCategory} />
      <Scaffold />
      <Styles />
    </ButtonWrapper>
  );
}
export default memo(BottomLeftButtons);
