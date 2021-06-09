import React, { memo } from 'react';
import styles from './index.less';
import ToolBar from './ToolComponents/ToolBar';


function BrickDeign() {
  return (
    <div className={styles['brickd-container']}>
      <ToolBar />
    </div>
  );
}

export default memo(BrickDeign);
