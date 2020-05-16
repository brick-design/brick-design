import React, { useState } from 'react';
import { Tabs } from 'antd';
import { flattenDeepArray } from '@/utils';
import config from '@/configs';
import FoldPanel from './components/foldPanel';
import styles from './index.less';
import TemplatePanel from './components/templatePanel';
import {BrickPreview} from 'bricks-web'
import {LEGO_BRIDGE} from 'brickd-core'
const { TabPane } = Tabs;

function AllComponents() {
  const [activeKey, setActiveKey] = useState('container');
  return (
    <Tabs className={styles['tabs-container']} activeKey={activeKey}
          onChange={(newActiveKey: string) => setActiveKey(newActiveKey)}>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'container'} key="container">
        <BrickPreview isShow={activeKey === 'container'}
                   componentsCategory={LEGO_BRIDGE.config!.CONTAINER_CATEGORY}
                   searchValues={LEGO_BRIDGE.containers!}

        />
      </TabPane>
      <TabPane forceRender className={styles['tabs-panel']}
               tab={'nonContainer'} key="nonContainer">
        <BrickPreview isShow={activeKey === 'nonContainer'}
                   componentsCategory={LEGO_BRIDGE.config!.NON_CONTAINER_CATEGORY}
                   searchValues={flattenDeepArray(LEGO_BRIDGE.config!.NON_CONTAINER_CATEGORY)}


        />
      </TabPane>
      <TabPane className={styles['tabs-panel']} style={{ paddingLeft: 20, paddingRight: 20 }}
               tab={'template'} key="module">
        <TemplatePanel  isShow={activeKey === 'module'}/>
      </TabPane>
    </Tabs>
  );
}


export default AllComponents;
