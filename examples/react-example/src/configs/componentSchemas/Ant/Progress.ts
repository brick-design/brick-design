import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Progress: ComponentSchemaType = {
	propsConfig: {
		percent: {
			label: '百分比',
			tip: '百分比',
			type: PROPS_TYPES.number,
			defaultValue: 50,
		},
		showInfo: {
			label: '进度数值显示',
			tip: '是否显示进度数值或状态图标',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		status: {
			label: '状态',
			tip: '	状态，可选：success exception active',
			type: PROPS_TYPES.enum,
			enumData: ['success', 'exception', 'active'],
		},
		type: {
			label: '类型',
			tip: '类型，可选 line circle dashboard',
			type: PROPS_TYPES.enum,
			enumData: ['line', 'circle', 'dashboard'],
		},
	},
}

export default Progress
