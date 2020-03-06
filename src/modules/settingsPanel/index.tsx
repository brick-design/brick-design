import React, { useState } from 'react';
import { Tabs } from 'antd/lib/index';
import PropsSettings from './propsSettings';
import StyleSettings from './styleSettings';
import DomTree from './domTree';
import { formatMessage } from 'umi-plugin-react/locale';

const { TabPane } = Tabs;

function SettingPanel() {

  const [activeKey, setActiveKey] = useState('1');

  return (
    <Tabs
      onChange={(activeKey: any) => setActiveKey(activeKey)}
      activeKey={activeKey}
    >
      <TabPane forceRender key="1" tab={formatMessage({ id: 'BLOCK_NAME.setting.domTree' })}>
        <DomTree/>
      </TabPane>
      <TabPane forceRender key="2" tab={formatMessage({ id: 'BLOCK_NAME.setting.props' })}>
        <PropsSettings/>
      </TabPane>
      <TabPane forceRender key="3" tab={formatMessage({ id: 'BLOCK_NAME.setting.styles' })}>
        <StyleSettings/>
      </TabPane>

    </Tabs>
  );
}

export default SettingPanel;
