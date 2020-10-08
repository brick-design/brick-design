import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Rate: ComponentSchemaType = {
	isNonContainer:true,

	nodePropsConfig: {
		character: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		allowClear: {
			label: '是否点击清除',
			tip: '是否允许再次点击后清除',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		allowHalf: {
			label: '是否允许半选',
			type: PROPS_TYPES.boolean,
		},
		autoFocus: {
			label: '自动获取焦点',
			type: PROPS_TYPES.boolean,
		},
		count: {
			label: '星星总数',
			type: PROPS_TYPES.number,
		},
		defaultValue: {
			label: '默认值',
			type: PROPS_TYPES.number,
		},
		disabled: {
			label: '是否禁用',
			tip: '只读，无法进行交互',
			type: PROPS_TYPES.boolean,
		},
		tooltips: {
			label: '自定义每项的提示信息',
			type: PROPS_TYPES.stringArray,
		},
		value: {
			label: '当前数，受控值',
			type: PROPS_TYPES.number,
		},
		onBlur: {
			label: '失去焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onChange: {
			label: '选择时回调',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onFocus: {
			label: '获取焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onHoverChange: {
			label: '鼠标经过时回调',
			tip: '鼠标经过时数值变化',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onKeyDown: {
			label: '按键回调',
			type: PROPS_TYPES.function,
			placeholder: '(event) => {}',
		},
	},
}
export default Rate
