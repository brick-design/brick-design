import React, { useState } from 'react';
import { Tabs } from 'antd';
import { flattenDeepArray } from './utils';
import styles from './index.less';
import { BrickPreview } from 'bricks-web';
import { LEGO_BRIDGE } from '../../core';
import { CONTAINER_CATEGORY, NON_CONTAINER_CATEGORY } from './/configs';

const { TabPane } = Tabs;

function AllComponents() {
  const [activeKey, setActiveKey] = useState('container');
  return (
    <Tabs  activeKey={activeKey}
          onChange={(newActiveKey: string) => setActiveKey(newActiveKey)}>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'container'} key="container">
        <BrickPreview
          isShow={activeKey === 'container'}
          componentsCategory={CONTAINER_CATEGORY}
          className={styles['preview-container']}

        />
      </TabPane>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'nonContainer'} key="nonContainer">
        <BrickPreview isShow={activeKey === 'nonContainer'}
                      componentsCategory={NON_CONTAINER_CATEGORY}
                      className={styles['preview-container']}


        />
      </TabPane>
    </Tabs>
  );
}


export default AllComponents;
