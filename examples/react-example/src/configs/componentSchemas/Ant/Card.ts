import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Card: ComponentSchemaType = {
	nodePropsConfig: {
		cover: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		extra: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		tabBarExtraContent: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		extra: {
			label: '卡片右上角的操作区域\t',
			tip: '卡片右上角的操作区域',
			type: PROPS_TYPES.string,
		},
		actions: {
			label: '卡片操作组',
			tip: '卡片操作组，位置在卡片底部',
			type: PROPS_TYPES.stringArray,
		},
		activeTabKey: {
			label: '当前激活页签',
			tip: '当前激活页签的 key	',
			type: PROPS_TYPES.string,
		},
		headStyle: {
			label: '标题样式',
			tip: '自定义标题区域样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		bodyStyle: {
			label: '内容样式',
			tip: '内容区域自定义样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		bordered: {
			label: '是否有边框',
			type: PROPS_TYPES.boolean,
		},

		defaultActiveTabKey: {
			label: '选中页签',
			tip: '初始化选中页签的 key，如果没有设置 activeTabKey',
			type: PROPS_TYPES.string,
		},
		hoverable: {
			label: '鼠标移过时可浮起',
			tip: '鼠标移过时可浮起',
			type: PROPS_TYPES.boolean,
		},
		loading: {
			label: '加载中效果',
			tip: '当卡片内容还在加载中时，可以用 loading 展示一个占位',
			type: PROPS_TYPES.boolean,
		},
		tabList: {
			label: '页签标题列表',
			tip: '页签标题列表',
			type: PROPS_TYPES.objectArray,
			childPropsConfig: [
				{
					key: {
						label: 'key',
						type: PROPS_TYPES.string,
					},
				},
			],
		},
		title: {
			label: '卡片标题',
			type: PROPS_TYPES.string,
		},
		size: {
			label: 'card 的尺寸',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'small'],
		},
		type: {
			label: '卡片类型，可设置为 inner 或 不设置',
			type: PROPS_TYPES.string,
		},
	},
}

const Grid: ComponentSchemaType = {
	propsConfig: {
		hoverable: {
			label: '鼠标移过时可浮起',
			tip: '鼠标移过时可浮起',
			type: PROPS_TYPES.boolean,
		},
	},
}

const Meta: ComponentSchemaType = {
	nodePropsConfig: {
		avatar: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		description: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		className: {
			label: '容器类名',
			type: PROPS_TYPES.string,
		},
	},
}

export default {
	Card,
	'Card.Grid': Grid,
	'Card.Meta': Meta,
}
