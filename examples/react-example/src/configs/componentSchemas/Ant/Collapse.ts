import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Collapse: ComponentSchemaType = {
	propsConfig: {
		activeKey: {
			label: '当前激活 tab 面板的 key',
			type: PROPS_TYPES.string,
		},
		defaultActiveKey: {
			label: '初始化选中面板的 key',
			type: PROPS_TYPES.string,
		},
		onChange: {
			label: '切换面板的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
	},
}

const Panel: ComponentSchemaType = {
	fatherNodesRule: ['Collapse'],
	nodePropsConfig: {
		header: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		disabled: {
			label: '禁用',
			tip: '禁用后的面板展开与否将无法通过用户交互改变',
			type: PROPS_TYPES.boolean,
		},
		forceRender: {
			label: '隐藏时是否渲染',
			tip: '被隐藏时是否渲染 DOM 结构',
			type: PROPS_TYPES.boolean,
		},
		key: {
			label: '对应 activeKey',
			type: PROPS_TYPES.string,
		},
		header: {
			label: '面板头内容',
			type: PROPS_TYPES.string,
		},
	},
}
export default {
	Collapse,
	'Collapse.Panel': Panel,
}
