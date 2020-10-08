import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Alert: ComponentSchemaType = {
	propsConfig: {
		message: {
			label: '警告提示内容',
			type: PROPS_TYPES.string,
			rules: [
				{
					required: true,
					message: '请输入提示信息',
				},
			],
		},
		showIcon: {
			label: '是否显示辅助图标',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		type: {
			label: '指定警告提示的样式',
			tip: '指定警告提示的样式，有四种选择 success、info、warning、error',
			type: PROPS_TYPES.enum,
			enumData: ['success', 'info', 'warning', 'error'],
			defaultValue: 'info',
		},
	},
}

export default Alert
