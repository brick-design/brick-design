import React, { useState } from 'react'
import { Tabs } from 'antd/lib/index'
import PropsSettings from './propsSettings'
import StyleSettings from './styleSettings'
import {
	BrickTree,
	PageConfigType,
	SelectedInfoType,
	STATE_PROPS,
	useSelector,
} from '@brickd/react'
import styles from '../index.less'
import get from 'lodash/get'

const { TabPane } = Tabs
type SettingPanelType = {
	selectedInfo: SelectedInfoType
	pageConfig: PageConfigType
}

function SettingPanel() {
	const { selectedInfo, pageConfig } = useSelector<
		SettingPanelType,
		STATE_PROPS
	>(['selectedInfo', 'pageConfig'])
	const [activeKey, setActiveKey] = useState('1')
	const { selectedKey } = selectedInfo || {}
	const style = get(pageConfig, [selectedKey, 'props', 'style'])
	return (
		<Tabs
			onChange={(activeKey: any) => setActiveKey(activeKey)}
			activeKey={activeKey}
		>
			<TabPane forceRender key="1" tab={'组件树'}>
				<BrickTree className={styles['brick-tree']} />
			</TabPane>
			<TabPane forceRender key="2" tab={'属性配置'}>
				<PropsSettings selectedInfo={selectedInfo} />
			</TabPane>
			<TabPane forceRender key="3" tab={'样式配置'}>
				<StyleSettings styleSetting={style} />
			</TabPane>
		</Tabs>
	)
}

export default SettingPanel
