import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Tabs: ComponentSchemaType = {
	nodePropsConfig: {
		tabBarExtraContent: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			isRequired: true,
			childNodesRule: ['Tabs.TabPane'],
		},
	},
	propsConfig: {
		activeKey: {
			label: '激活面板key',
			tip: '当前激活 tab 面板的 key',
			type: PROPS_TYPES.string,
		},
		animated: {
			label: '使用动画切换',
			tip: '是否使用动画切换 Tabs，在 tabPosition=top|bottom 时有效',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		defaultActiveKey: {
			label: '初始选中面板',
			tip: '初始化选中面板的 key，如果没有设置 activeKey',
			type: PROPS_TYPES.string,
		},
		hideAdd: {
			label: '隐藏加号图标',
			tip: '是否隐藏加号图标，在 type="editable-card" 时有效',
			type: PROPS_TYPES.boolean,
		},
		size: {
			label: '大小',
			tip: '大小，提供 large default 和 small 三种大小',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
			defaultValue: 'default',
		},
		tabBarGutter: {
			label: 'tabs的间隙',
			tip: 'tabs 之间的间隙',
			type: PROPS_TYPES.number,
		},
		tabBarStyle: {
			label: 'tab bar的样式',
			tip: 'tab bar 的样式对象',
			type: PROPS_TYPES.object,
		},
		tabPosition: {
			label: '页签位置',
			tip: '页签位置，可选值有 top right bottom left',
			type: PROPS_TYPES.enum,
			enumData: ['top', 'right', 'bottom', 'left'],
		},
		type: {
			label: '页签类型',
			tip: '页签的基本样式，可选 line、card editable-card 类型',
			type: PROPS_TYPES.enum,
			enumData: ['line', 'card', 'editable-card'],
		},
		onChange: {
			label: '页签改变回调',
			type: PROPS_TYPES.function,
			placeholder: '(activeKey) => {}',
		},
		onEdit: {
			label: '新增和删除的回调',
			tip: '新增和删除页签的回调，在 type="editable-card" 时有效',
			type: PROPS_TYPES.function,
			placeholder: '(targetKey, action) => {}',
		},
		onNextClick: {
			label: 'next按钮点击回调',
			tip: 'next 按钮被点击的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onPrevClick: {
			label: 'prev按钮点击回调',
			tip: 'prev 按钮被点击的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onTabClick: {
			label: 'tab按钮点击回调',
			tip: 'tab 按钮被点击的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		renderTabBar: {
			label: '替换TabBar',
			tip: '替换TabBar，用于二次封装标签头',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
	},
}

const TabPane: ComponentSchemaType = {
	fatherNodesRule: ['Tabs.children'],
	nodePropsConfig: {
		tab: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		tab: {
			label: '选项卡头显示文字',
			type: PROPS_TYPES.string,
			isRequired: true,
			defaultValue: 'tab',
		},
		forceRender: {
			label: '隐藏是否渲染',
			tip: '被隐藏时是否渲染 DOM 结构',
			type: PROPS_TYPES.boolean,
		},
		key: {
			label: '对应activeKey',
			type: PROPS_TYPES.string,
			isRequired: true,
			defaultValue: 'tab',
		},
	},
}

export default {
	Tabs,
	'Tabs.TabPane': TabPane,
}
