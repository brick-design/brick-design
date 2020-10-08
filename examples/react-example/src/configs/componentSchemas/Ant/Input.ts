import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Input: ComponentSchemaType = {
	nodePropsConfig: {
		addonAfter: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '后置标签',
		},
		addonBefore: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '前置标签',
		},
		prefix: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '前缀图标',
		},
		suffix: {
			type: NODE_PROPS_TYPES.reactNode,
			label: '后缀图标',
		},
	},
	propsConfig: {
		addonAfter: {
			label: '带标签的 input，设置后置标签',
			type: PROPS_TYPES.string,
		},
		addonBefore: {
			label: '带标签的 input，设置前置标签',
			type: PROPS_TYPES.string,
		},
		allowClear: {
			label: '是否显示清除按钮',
			type: PROPS_TYPES.boolean,
		},
		prefix: {
			label: '带有前缀图标的 input',
			type: PROPS_TYPES.string,
		},
		suffix: {
			label: '带有后缀图标的 input',
			type: PROPS_TYPES.string,
		},
		placeholder: {
			label: 'placeholder',
			type: PROPS_TYPES.string,
		},
		defaultValue: {
			label: '默认内容',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '禁用状态',
			tip: '是否禁用状态，默认为 false',
			type: PROPS_TYPES.boolean,
		},
		id: {
			label: 'id',
			tip: '输入框的 id',
			type: PROPS_TYPES.string,
		},
		maxLength: {
			label: '最大长度',
			type: PROPS_TYPES.number,
		},
		size: {
			label: '控件大小',
			tip:
				'控件大小。注：标准表单内的输入框大小限制为 large。可选 large default small',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
			defaultValue: 'default',
		},
		type: {
			label: '声明 input 类型',
			tip: '声明 input 类型，同原生 input 标签的 type 属性',
			type: PROPS_TYPES.enum,
			enumData: [
				'button',
				'checkbox',
				'file',
				'hidden',
				'image',
				'password',
				'radio',
				'reset',
				'submit',
				'text',
			],
			defaultValue: 'text',
		},
		value: {
			label: '输入框内容',
			type: PROPS_TYPES.string,
		},
		onPressEnter: {
			label: '按下回车回调',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
		onChange: {
			label: '输入框内容变化时的回调',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
	},
}
const Group: ComponentSchemaType = {
	nodePropsConfig: {
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Input'],
		},
	},
	propsConfig: {
		compact: {
			label: '是否用紧凑模式',
			type: PROPS_TYPES.boolean,
		},
		size: {
			label: '大小',
			tip: 'Input.Group 中所有的 Input 的大小，可选 large default small',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
		},
	},
}
const Search: ComponentSchemaType = {
	isNonContainer:true,

	nodePropsConfig: {
		enterButton: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		enterButton: {
			label: '是否有确认按钮',
			tip: '是否有确认按钮，可设为按钮文字。该属性会与 addon 冲突',
			type: PROPS_TYPES.boolean,
		},
		onSearch: {
			label: '点击搜索或按下回车键时的回调',
			type: PROPS_TYPES.function,
			placeholder: '(value, event)=>{}',
		},
		loading: {
			label: '搜索 loading',
			type: PROPS_TYPES.boolean,
		},
		...Input.propsConfig,
	},
}
const TextArea: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		autoSize: {
			label: '自适应内容高度',
			tip:
				'自适应内容高度，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }。3.24.0 后 autosize 被废弃，请使用 autoSize。',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
		},
		defaultValue: {
			label: '默认内容',
			type: PROPS_TYPES.string,
		},
		value: {
			label: '输入框内容',
			type: PROPS_TYPES.string,
		},
		onPressEnter: {
			label: '按下回车回调',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
		allowClear: {
			label: '是否显示清除按钮',
			type: PROPS_TYPES.boolean,
		},
	},
}
const Password: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		visibilityToggle: {
			label: '是否显示切换按钮',
			type: PROPS_TYPES.boolean,
		},
		...Input.propsConfig,
	},
}
export default {
	Input,
	'Input.Search': Search,
	'Input.TextArea': TextArea,
	'Input.Group': Group,
	'Input.Password': Password,
}
