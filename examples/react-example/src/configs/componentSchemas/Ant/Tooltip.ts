import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Tooltip: ComponentSchemaType = {
	mirrorModalField: {
		displayPropName: 'visible',
	},

	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		arrowPointAtCenter: {
			label: '箭头指向中心',
			tip: '箭头是否指向目标元素中心，antd@1.11+ 支持',
			type: PROPS_TYPES.boolean,
		},
		autoAdjustOverflow: {
			label: '自动调整位置',
			tip: '气泡被遮挡时自动调整位置',
			type: PROPS_TYPES.boolean,
		},
		mouseEnterDelay: {
			label: '鼠标移入后延时',
			tip: '鼠标移入后延时多少才显示 Tooltip，单位：秒',
			type: PROPS_TYPES.number,
		},
		mouseLeaveDelay: {
			label: '鼠标移出后延时',
			tip: '鼠标移出后延时多少才隐藏 Tooltip，单位：秒',
			type: PROPS_TYPES.number,
		},
		title: {
			label: '提示文字',
			type: PROPS_TYPES.string,
		},
		overlayStyle: {
			label: '卡片样式',
			type: [PROPS_TYPES.object, PROPS_TYPES.json],
		},
		placement: {
			label: '气泡框位置',
			type: PROPS_TYPES.enum,
			enumData: [
				'top',
				'left',
				'right',
				'bottom',
				'topLeft',
				'topRight',
				'bottomLeft',
				'bottomRight',
				'leftTop',
				'leftBottom',
				'rightTop',
				'rightBottom',
			],
			defaultValue: 'top',
		},
		trigger: {
			label: '触发行为',
			type: PROPS_TYPES.enum,
			enumData: ['hover', 'focus', 'click', 'contextMenu'],
			defaultValue: 'hover',
		},
		onVisibleChange: {
			label: '显示隐藏的回调',
			type: PROPS_TYPES.function,
			placeholder: '(visible) => {}',
		},
	},
}

export default Tooltip
