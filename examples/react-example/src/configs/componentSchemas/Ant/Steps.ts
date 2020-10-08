import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Steps: ComponentSchemaType = {
	nodePropsConfig: {
		progressDot: {
			type: NODE_PROPS_TYPES.functionReactNode,
			isOnlyNode: true,
			params: ['iconDot', `{index, status, title, description}`],
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		type: {
			label: '步骤条类型',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'navigation'],
		},
		current: {
			label: '指定当前步骤',
			tip:
				'指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态',
			type: PROPS_TYPES.number,
		},
		direction: {
			label: '指定步骤条方向',
			tip:
				'指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向',
			type: PROPS_TYPES.enum,
			enumData: ['horizontal', 'vertical'],
		},
		labelPlacement: {
			label: '指定标签放置位置',
			tip: '指定标签放置位置，默认水平放图标右侧，可选 vertical 放图标下方',
			type: PROPS_TYPES.string,
		},
		progressDot: {
			label: '点状步骤条',
			tip:
				'点状步骤条，可以设置为一个 function，labelPlacement 将强制为 vertical',
			type: PROPS_TYPES.boolean,
		},
		size: {
			label: '指定大小',
			tip: '指定大小，目前支持普通（default）和迷你（small）',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'small'],
		},
		status: {
			label: '指定当前步骤的状态',
			type: PROPS_TYPES.enum,
			enumData: ['wait', 'process', 'finish', 'error'],
		},
		initial: {
			label: '起始序号',
			tip: '起始序号，从 0 开始记数',
			type: PROPS_TYPES.number,
		},
		onChange: {
			label: '点击切换步骤时触发',
			type: PROPS_TYPES.function,
			placeholder: '(current) => {}',
		},
	},
}

const Step: ComponentSchemaType = {
	nodePropsConfig: {
		description: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		icon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		subTitle: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		description: {
			label: '步骤的详情描述',
			type: PROPS_TYPES.string,
		},
		icon: {
			label: '步骤图标的类型',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '标题',
			type: PROPS_TYPES.string,
		},
		subTitle: {
			label: '子标题',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '禁用点击',
			type: PROPS_TYPES.boolean,
		},
		status: {
			label: '指定当前步骤的状态',
			type: PROPS_TYPES.enum,
			enumData: ['wait', 'process', 'finish', 'error'],
		},
	},
}

export default {
	Steps,
	'Steps.Step': Step,
}
