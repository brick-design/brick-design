import React, { useState } from 'react';
import { Tabs } from 'antd';
import { flattenDeepArray } from './utils';
import styles from './index.less';
import { BrickPreview } from 'bricks-web';
import { LEGO_BRIDGE } from 'brickd-core';

const { TabPane } = Tabs;

function AllComponents() {
  const [activeKey, setActiveKey] = useState('container');
  return (
    <Tabs  activeKey={activeKey}
          onChange={(newActiveKey: string) => setActiveKey(newActiveKey)}>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'container'} key="container">
        <div className={styles['tabs-container']}>
        <BrickPreview isShow={activeKey === 'container'}
                   componentsCategory={LEGO_BRIDGE.config!.CONTAINER_CATEGORY}

        />
        </div>
      </TabPane>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'nonContainer'} key="nonContainer">
        <BrickPreview isShow={activeKey === 'nonContainer'}
                   componentsCategory={LEGO_BRIDGE.config!.NON_CONTAINER_CATEGORY}


        />
      </TabPane>
    </Tabs>
  );
}


export default AllComponents;
