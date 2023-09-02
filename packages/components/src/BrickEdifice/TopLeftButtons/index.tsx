import React, { memo } from 'react';

import styles from './index.less';
import Layers from '../../Panels/Layers';
import { Icon } from '../../Components';
import { downloadIcon, uploadIcon } from '../../assets';
import { ButtonWrapper } from '../../Abilities';

function TopLeftButtons() {
  // const [isDragMove,setIsDragMove]=useState<boolean>();
  const PANEL_KEYS=['Layers'];
  return (
    <ButtonWrapper panelKeys={PANEL_KEYS} className={styles['top-left-bar']}>
      <Layers />
      <Icon
        icon={uploadIcon}
        className={styles['icon-Menu']}
        iconClass={styles['icon-class']}
      />
      <Icon
        icon={downloadIcon}
        className={styles['icon-Menu']}
        iconClass={styles['icon-class']}
      />
      {/*<Checkbox onChange={setIsDragMove} checkedIcon={dragIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>*/}
    </ButtonWrapper>
  );
}

export default memo(TopLeftButtons);
