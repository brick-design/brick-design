import React, { useState } from 'react';
import { Tabs } from 'antd/lib/index';
import PropsSettings from './propsSettings';
import StyleSettings from './styleSettings';
import {useSelector} from 'brickd-core'
import {BrickTree} from 'bricks-web'

const { TabPane } = Tabs;
function SettingPanel() {
const {styleSetting,propsSetting,selectedInfo}=useSelector(['styleSetting','propsSetting', 'selectedInfo'])
  const [activeKey, setActiveKey] = useState('1');

  return (
    <Tabs
      onChange={(activeKey: any) => setActiveKey(activeKey)}
      activeKey={activeKey}
    >
      <TabPane forceRender key="1" tab={'组件树'}>
        <BrickTree/>
      </TabPane>
      <TabPane forceRender key="2" tab={'属性配置'}>
        <PropsSettings propsSetting={propsSetting} selectedInfo={selectedInfo}/>
      </TabPane>
      <TabPane forceRender key="3" tab={'样式配置'}>
        <StyleSettings styleSetting={selectedInfo&&selectedInfo.style}/>
      </TabPane>

    </Tabs>
  );
}

export default SettingPanel;
