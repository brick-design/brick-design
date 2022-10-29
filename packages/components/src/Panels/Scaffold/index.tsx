import React, { memo } from 'react';
import styles from './index.less';
import Props from './Props';
import Senior from './Senior';
import { propIcon } from '../../assets';
import BarTabs, { TabPane } from '../../Components/BarTabs';
// interface BrickDesignRightProps {}

function Scaffold() {
  return (
    <BarTabs icon={propIcon} className={styles['right-container']}>
      <TabPane tab={'属性'} key={'1'}>
        <Props isCommon />
      </TabPane>
      <TabPane tab={'高级'} key={'2'}>
        <Senior/>
      </TabPane>
      <TabPane tab={'方法'} key={'3'}>
        <Props/>
      </TabPane>
    </BarTabs>
  );
}

export default memo(Scaffold);
