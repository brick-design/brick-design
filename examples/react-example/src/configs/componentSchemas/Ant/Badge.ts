import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Badge: ComponentSchemaType = {
	nodePropsConfig: {
		count: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		color: {
			label: '自定义小圆点的颜色',
			type: PROPS_TYPES.string,
			isShowColor: true,
			inputColProps: { span: 18 },
		},
		count: {
			label: '展示的数字',
			tip:
				'展示的数字，大于 overflowCount 时显示为 overflowCount，为 0 时隐藏',
			type: PROPS_TYPES.number,
		},
		dot: {
			label: '只展示小红点',
			tip: '不展示数字，只有一个小红点',
			type: PROPS_TYPES.boolean,
		},
		offset: {
			label: '位置偏移',
			tip: '设置状态点的位置偏移，格式为 [x, y]',
			type: PROPS_TYPES.numberArray,
			maxTagCount: 2,
		},
		overflowCount: {
			label: '展示封顶的数字值',
			type: PROPS_TYPES.number,
		},
		showZero: {
			label: '数值为 0 时，是否展示',
			tip: '当数值为 0 时，是否展示 Badge',
			type: PROPS_TYPES.boolean,
		},
		status: {
			label: '设置 Badge 为状态点',
			tip: '设置 Badge 为状态点',
			type: PROPS_TYPES.enum,
			enumData: ['success', 'processing', 'default', 'error', 'warning'],
		},
		text: {
			label: '状态点的文本',
			tip: '在设置了 status 的前提下有效，设置状态点的文本',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '鼠标悬浮文字',
			tip: '设置鼠标放在状态点上时显示的文字	',
			type: PROPS_TYPES.string,
		},
	},
}

export default Badge
