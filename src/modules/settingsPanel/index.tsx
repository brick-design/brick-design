import React, { Component } from 'react';
import { Tabs } from 'antd/lib/index';
import PropsSettings from './propsSettings';
import StyleSettings from './styleSettings';
import DomTree from './domTree';

const { TabPane } = Tabs;
interface SettingPanelStateType {
  activeKey:string
}
export default class SettingPanel extends Component<any,SettingPanelStateType> {

  constructor(props:any) {
    super(props);
    this.state = {
      activeKey: '1',
    };
  }

  onChange = (activeKey:any) => {
    this.setState({ activeKey });
  };

  render() {
    const { activeKey } = this.state;
    return (
      <Tabs
        onChange={this.onChange}
        activeKey={activeKey}
      >
        <TabPane forceRender key="1" tab="页面结构">
          <DomTree/>
        </TabPane>
        <TabPane forceRender key="2" tab="属性配置">
          <PropsSettings/>
        </TabPane>
        <TabPane forceRender key="3" tab="样式配置">
          <StyleSettings/>
        </TabPane>

      </Tabs>
    );
  }
}
