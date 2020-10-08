import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Timeline: ComponentSchemaType = {
	nodePropsConfig: {
		pending: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		pendingDot: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		pending: {
			label: '是否存在或内容',
			tip: '指定最后一个幽灵节点是否存在或内容',
			type: PROPS_TYPES.boolean,
		},
		pendingDot: {
			label: '时间图点',
			tip: '当最后一个幽灵节点存在時，指定其时间图点',
			type: PROPS_TYPES.string,
		},
		reverse: {
			label: '节点排序',
			tip: '节点排序',
			type: PROPS_TYPES.boolean,
		},
		mode: {
			label: '相对位置',
			tip: '通过设置 mode 可以改变时间轴和内容的相对位置',
			type: PROPS_TYPES.enum,
			enumData: ['left', 'alternate', 'right'],
		},
	},
}
const Item: ComponentSchemaType = {
	nodePropsConfig: {
		dot: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		color: {
			label: '指定圆圈颜色',
			type: PROPS_TYPES.string,
		},

		dot: {
			label: '自定义时间轴点',
			type: PROPS_TYPES.string,
		},
		position: {
			label: '自定义节点位置',
			type: PROPS_TYPES.enum,
			enumData: ['left', 'right'],
		},
	},
}

export default {
	Timeline,
	'Timeline.Item': Item,
}
