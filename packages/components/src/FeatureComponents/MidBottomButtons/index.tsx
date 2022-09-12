import React, { memo } from 'react';
import UndoRedo from './UndoRedo';
import styles from './index.less';
import Zoom from './Zoom';
import Icon from '../../Components/Icon';
import { openEye, saveIcon } from '../../assets';

function MidBottomButtons() {
  return (
    <div className={styles['container']}>
      <UndoRedo isUndo />
      <UndoRedo />
      <div className={styles['divider']} />
      <Zoom type={'out'} />
      <Zoom />
      <Zoom type={'in'} />
      <div className={styles['divider']} />
      <Icon
        className={styles['icon-container']}
        iconClass={styles['icon-class']}
        icon={openEye}
      />
      <Icon
        className={styles['icon-container']}
        iconClass={styles['icon-class']}
        icon={saveIcon}
      />
    </div>
  );
}

export default memo(MidBottomButtons);
