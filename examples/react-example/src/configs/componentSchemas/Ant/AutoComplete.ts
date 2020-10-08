import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const AutoComplete: ComponentSchemaType = {
	nodePropsConfig: {
		dataSource: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['AutoComplete.Option', 'AutoComplete.OptGroup'],
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		dataSource: {
			label: '自动完成的数据源',
			type: [PROPS_TYPES.objectArray, PROPS_TYPES.stringArray],
		},
		dropdownMenuStyle: {
			label: 'dropdown 菜单自定义样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		defaultValue: {
			label: '指定默认选中的条目',
			type: [PROPS_TYPES.stringArray, PROPS_TYPES.string],
		},
		filterOption: {
			label: '输入筛选',
			tip:
				'是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。',
			type: PROPS_TYPES.function,
			placeholder: '(inputValue, option) => {}',
		},
		getPopupContainer: {
			label: '菜单渲染父节点',
			tip:
				'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。',
			type: PROPS_TYPES.function,
			placeholder: '(triggerNode) => document.body',
		},
		optionLabelProp: {
			label: '选择框回填',
			tip:
				'回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value',
			type: PROPS_TYPES.string,
		},
		placeholder: {
			label: '输入框提示',
			type: PROPS_TYPES.string,
		},
		value: {
			label: '指定当前选中的条目',
			type: [PROPS_TYPES.stringArray, PROPS_TYPES.string],
		},

		allowClear: {
			label: '是否可清除',
			tip: '支持清除, 单选模式有效',
			type: PROPS_TYPES.boolean,
		},
		autoFocus: {
			label: '是否获取焦点',
			type: PROPS_TYPES.boolean,
		},
		backfill: {
			label: '回填选中项',
			tip: '使用键盘选择选项的时候把选中项回填到输入框中',
			type: PROPS_TYPES.boolean,
		},
		defaultActiveFirstOption: {
			label: '是否默认高亮第一个选项',
			type: PROPS_TYPES.boolean,
		},

		onBlur: {
			label: '失去焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},

		onChange: {
			label: '内容改变回调函数',
			tip: '选中 option，或 input 的 value 变化时，调用此函数',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},

		onFocus: {
			label: '获得焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},

		onSearch: {
			label: '搜索补全项的回调',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},

		onSelect: {
			label: '被选中时回调',
			tip: '被选中时调用，参数为选中项的 value 值',
			type: PROPS_TYPES.function,
			placeholder: '(value, option) => {}',
		},
		defaultOpen: {
			label: '是否默认展开下拉菜单',
			type: PROPS_TYPES.boolean,
		},

		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		open: {
			label: '是否展开下拉菜单',
			type: PROPS_TYPES.boolean,
		},
		onDropdownVisibleChange: {
			label: '展开下拉菜单',
			tip: '展开下拉菜单的回调',
			type: PROPS_TYPES.function,
			placeholder: '(open)=>{}',
		},
	},
}
const Option: ComponentSchemaType = {
	propsConfig: {
		value: {
			label: 'value',
			type: PROPS_TYPES.string,
		},
		key: {
			label: 'key',
			type: PROPS_TYPES.string,
		},
	},
}
const OptGroup: ComponentSchemaType = {
	nodePropsConfig: {
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['AutoComplete.Option'],
		},
	},
	propsConfig: {
		label: {
			label: 'label',
			type: PROPS_TYPES.string,
		},
		key: {
			label: 'key',
			type: PROPS_TYPES.string,
		},
	},
}

export default {
	AutoComplete,
	'AutoComplete.Option': Option,
	'AutoComplete.OptGroup': OptGroup,
}
