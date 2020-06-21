import React, { useState } from 'react';
import { Tabs } from 'antd/lib/index';
import PropsSettings from './propsSettings';
import StyleSettings from './styleSettings';
import { ComponentConfigsType, SelectedInfoType, STATE_PROPS, useSelector } from '../../../core';
import { BrickTree } from 'bricks-web';
import styles from '../index.less'
import get  from 'lodash/get';

const { TabPane } = Tabs;
type SettingPanelType={
  selectedInfo:SelectedInfoType,
  componentConfigs:ComponentConfigsType
}
function SettingPanel() {
const {selectedInfo,componentConfigs}=useSelector<SettingPanelType,STATE_PROPS>(['selectedInfo','componentConfigs'])
  console.log('componentConfigs>>>>',JSON.stringify(componentConfigs))
  const [activeKey, setActiveKey] = useState('1');
const {props:selectProps,selectedKey}=selectedInfo||{}
const style=get(componentConfigs,[selectedKey,'props','style'])
  return (
    <Tabs
      onChange={(activeKey: any) => setActiveKey(activeKey)}
      activeKey={activeKey}
    >
      <TabPane forceRender key="1" tab={'组件树'}>
        <BrickTree className={styles['brick-tree']} />
      </TabPane>
      <TabPane forceRender key="2" tab={'属性配置'}>
        <PropsSettings selectedInfo={selectedInfo}/>
      </TabPane>
      <TabPane forceRender key="3" tab={'样式配置'}>
        <StyleSettings styleSetting={style}/>
      </TabPane>

    </Tabs>
  );
}

export default SettingPanel;
