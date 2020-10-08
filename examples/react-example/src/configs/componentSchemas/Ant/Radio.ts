import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Radio: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		autoFocus: {
			label: '自动获取焦点',
			tip: '自动获取焦点',
			type: PROPS_TYPES.boolean,
		},
		value: {
			label: '根据 value 进行比较，判断是否选中',
			type: PROPS_TYPES.string,
		},
		checked: {
			label: '指定是否选中',
			tip: '指定当前是否选中',
			type: PROPS_TYPES.boolean,
		},
		defaultChecked: {
			label: '初始是否选中',
			tip: '初始是否选中',
			type: PROPS_TYPES.boolean,
		},
	},
}

const Button: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		value: {
			label: '根据 value 进行比较，判断是否选中',
			type: PROPS_TYPES.string,
		},
	},
}
const Group: ComponentSchemaType = {
	nodePropsConfig: {
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Radio', 'Radio.Button'],
		},
	},
	propsConfig: {
		defaultValue: {
			label: '默认选中的值',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '禁选所有子单选器',
			type: PROPS_TYPES.boolean,
		},
		name: {
			label: 'name',
			tip: 'RadioGroup 下所有 input[type="radio"] 的 name 属性',
			type: PROPS_TYPES.string,
		},
		options: {
			label: '以配置形式设置子元素',
			type: [PROPS_TYPES.stringArray, PROPS_TYPES.objectArray],
			childPropsConfig: [
				{
					label: {
						label: 'label',
						type: PROPS_TYPES.string,
					},
					value: {
						label: 'value',
						type: PROPS_TYPES.string,
					},
					disabled: {
						label: 'disabled',
						type: PROPS_TYPES.boolean,
					},
				},
			],
		},
		size: {
			label: '大小',
			tip: '大小，只对按钮样式生效',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'default', 'small'],
		},
		value: {
			label: '用于设置当前选中的值',
			type: PROPS_TYPES.string,
		},
		onChange: {
			label: '选项变化时的回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
		buttonStyle: {
			label: 'RadioButton 的风格样式',
			tip: 'RadioButton 的风格样式，目前有描边和填色两种风格',
			type: PROPS_TYPES.enum,
			enumData: ['outline', 'solid'],
		},
	},
}
export default {
	Radio,
	'Radio.Button': Button,
	'Radio.Group': Group,
}
