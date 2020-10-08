import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Checkbox: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		autoFocus: {
			label: '是否自动获取焦点',
			type: PROPS_TYPES.boolean,
		},
		checked: {
			label: '当前是否选中',
			type: PROPS_TYPES.boolean,
		},
		defaultChecked: {
			label: '初始被选中状态',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		indeterminate: {
			label: '模糊状态',
			tip: '设置 indeterminate 状态，只负责样式控制',
			type: PROPS_TYPES.boolean,
		},
		onChange: {
			label: '变化时回调',
			tip: '变化时回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
	},
}

const Group: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		defaultValue: {
			label: '默认选中的选项',
			type: PROPS_TYPES.stringArray,
		},
		disabled: {
			label: '整组失效',
			type: PROPS_TYPES.boolean,
		},
		name: {
			label: 'name',
			tip: 'CheckboxGroup 下所有 input[type="checkbox"] 的 name 属性',
			type: PROPS_TYPES.string,
		},
		options: {
			label: '指定可选项',
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
						label: '禁用',
						type: PROPS_TYPES.boolean,
					},
				},
			],
		},
		value: {
			label: '指定选中的选项',
			type: PROPS_TYPES.stringArray,
		},
		onChange: {
			label: '变化时回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(checkedValue)=>{}',
		},
	},
}

export default {
	Checkbox,
	'Checkbox.Group': Group,
}
