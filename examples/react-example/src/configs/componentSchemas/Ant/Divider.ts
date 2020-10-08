import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Divider: ComponentSchemaType = {
	propsConfig: {
		dashed: {
			label: '是否虚线',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		children: {
			label: '分割线标题',
			type: PROPS_TYPES.string,
		},
		orientation: {
			label: '分割线标题位置',
			type: PROPS_TYPES.enum,
			enumData: ['left', 'right', 'center'],
			defaultValue: '',
		},
		type: {
			label: '显示类型',
			tip: '水平还是垂直类型',
			type: PROPS_TYPES.enum,
			enumData: ['horizontal', 'vertical'],
			defaultValue: 'horizontal',
		},
	},
}

export default Divider
