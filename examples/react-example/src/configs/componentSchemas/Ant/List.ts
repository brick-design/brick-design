import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const List: ComponentSchemaType = {
	nodePropsConfig: {
		header: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '头部',
		},
		footer: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '底部',
		},
		loadMore: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		'#renderItem': {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['item'],
			isOnlyNode: true,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		dataSource: {
			label: '数据源',
			type: PROPS_TYPES.objectArray,
			childPropsConfig: [{}],
		},
		size: {
			label: '控件大小',
			tip:
				'控件大小。注：标准表单内的输入框大小限制为 large。可选 large default small',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
			defaultValue: 'default',
		},
		footer: {
			label: '列表底部',
			type: PROPS_TYPES.string,
		},
		header: {
			label: '列表头部',
			type: PROPS_TYPES.string,
		},
		bordered: {
			label: '是否展示边框',
			type: PROPS_TYPES.boolean,
		},
		grid: {
			label: '列表栅格配置',
			type: PROPS_TYPES.object,
		},
		itemLayout: {
			label: '设置布局',
			type: PROPS_TYPES.enum,
			enumData: ['vertical', 'horizontal'],
			defaultValue: 'horizontal',
		},
		loadMore: {
			label: '加载更多文案',
			type: PROPS_TYPES.string,
		},
		locale: {
			label: '默认文案设置',
			type: PROPS_TYPES.object,
			defaultValue: {
				emptyText: '暂无数据',
			},
		},
		pagination: {
			label: '是否展示分页',
			type: PROPS_TYPES.boolean,
		},
		split: {
			label: '是否展示分割线',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
	},
}
const Item: ComponentSchemaType = {
	nodePropsConfig: {
		actions: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		extra: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		children: {
			label: 'item内容',
			type: PROPS_TYPES.string,
		},
		extra: {
			label: '额外内容',
			type: PROPS_TYPES.string,
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
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		description: {
			label: '列表元素的描述内容',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '列表元素的标题',
			type: PROPS_TYPES.string,
		},
	},
}
export default {
	List,
	'List.Item': Item,
	'List.Item.Meta': Meta,
}
