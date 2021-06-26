import React, { memo } from 'react';
import styles from './index.less';
import {  propIcon } from '../../assets';
import BarTabs, { TabPane } from '../../Components/BarTabs';
// interface BrickDesignRightProps {}

function BrickDesignRight() {

  return (<BarTabs icon={propIcon} className={styles['right-container']}>
        <TabPane tab={'属性'} key={'1'}/>
      <TabPane tab={'事件'} key={'2'}/>
        <TabPane tab={'高级'} key={'3'}/>
      </BarTabs>
  );
}

export default memo(BrickDesignRight);
