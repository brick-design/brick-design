import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const InputNumber: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		autoFocus: {
			label: '是否自动获取焦点',
			type: PROPS_TYPES.boolean,
		},
		defaultValue: {
			label: '初始值',
			type: PROPS_TYPES.number,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		formatter: {
			label: '展示值格式',
			tip: '指定输入框展示值的格式',
			type: PROPS_TYPES.function,
			placeholder: '(value) => ""',
		},
		max: {
			label: '最大值',
			type: PROPS_TYPES.number,
		},
		min: {
			label: '最小值',
			type: PROPS_TYPES.number,
		},
		parser: {
			label: '指定从 formatter 里转换回数字的方式',
			tip: '指定从 formatter 里转换回数字的方式，和 formatter 搭配使用',
			type: PROPS_TYPES.function,
			placeholder: '(string)=> Number',
		},
		precision: {
			label: '数值精度',
			type: PROPS_TYPES.number,
		},
		decimalSeparator: {
			label: '小数点',
			type: PROPS_TYPES.string,
		},
		size: {
			label: '输入框大小',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
			defaultValue: 'default',
		},
		step: {
			label: '步差',
			tip: '每次改变步数，可以为小数',
			type: [PROPS_TYPES.string, PROPS_TYPES.number],
			defaultValue: '1',
		},
		value: {
			label: '当前值',
			type: PROPS_TYPES.number,
		},
		onChange: {
			label: '变化回调',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onPressEnter: {
			label: '按下回车的回调',
			type: PROPS_TYPES.function,
			placeholder: `(e)=>{}`,
		},
	},
}

export default InputNumber
