import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Select: ComponentSchemaType = {
	nodePropsConfig: {
		dropdownRender: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['menuNode', 'props'],
		},
		maxTagPlaceholder: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		suffixIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		removeIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		clearIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		menuItemSelectedIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Select.OptGroup', 'Select.Option'],
		},
	},
	propsConfig: {
		allowClear: {
			label: '支持清除',
			type: PROPS_TYPES.boolean,
		},
		autoClearSearchValue: {
			label: '是否在选中项后清空搜索框',
			tip: '是否在选中项后清空搜索框，只在 mode 为 multiple 或 tags 时有效。',
			type: PROPS_TYPES.boolean,
		},
		autoFocus: {
			label: '默认获取焦点',
			type: PROPS_TYPES.boolean,
		},
		defaultActiveFirstOption: {
			label: '是否默认高亮第一个选项',
			type: PROPS_TYPES.boolean,
		},
		defaultValue: {
			label: '输入框默认值',
			type: [
				PROPS_TYPES.string,
				PROPS_TYPES.stringArray,
				PROPS_TYPES.number,
				PROPS_TYPES.numberArray,
			],
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		dropdownClassName: {
			label: '下拉菜单的 className 属性',
			type: PROPS_TYPES.string,
		},
		dropdownMatchSelectWidth: {
			label: '下拉菜单和选择器同宽',
			type: PROPS_TYPES.boolean,
		},
		dropdownStyle: {
			label: '下拉菜单的 style 属性',
			type: [PROPS_TYPES.object, PROPS_TYPES.json],
		},
		dropdownMenuStyle: {
			label: 'dropdown 菜单自定义样式',
			type: [PROPS_TYPES.object, PROPS_TYPES.json],
		},
		filterOption: {
			label: '是否根据输入项进行筛选',
			tip:
				'是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.function],
			placeholder: '(inputValue, option)=>{}',
		},
		firstActiveValue: {
			label: '默认高亮的选项',
			type: [PROPS_TYPES.string, PROPS_TYPES.stringArray],
		},
		getPopupContainer: {
			label: '菜单渲染父节点',
			tip:
				'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位',
			type: PROPS_TYPES.function,
			placeholder: '() => document.body',
		},
		labelInValue: {
			label: '是否把每个选项的 label 包装到 value 中',
			tip:
				'是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 {key: string, label: ReactNode} 的格式',
			type: PROPS_TYPES.boolean,
		},
		maxTagCount: {
			label: '最多显示多少个 tag',
			type: PROPS_TYPES.number,
		},
		maxTagTextLength: {
			label: '最大显示的 tag 文本长度',
			type: PROPS_TYPES.number,
		},

		maxTagPlaceholder: {
			label: '隐藏 tag 时显示的内容',
			type: PROPS_TYPES.function,
			placeholder: '(omittedValues)=>{}',
		},
		mode: {
			label: '设置select的模式',
			type: PROPS_TYPES.enum,
			enumData: ['multiple', 'tags'],
		},
		notFoundContent: {
			label: '当下拉列表为空时显示的内容',
			type: PROPS_TYPES.string,
		},
		optionFilterProp: {
			label: '搜索过滤option',
			tip: '搜索时过滤对应的option属性，如设置为children表示对内嵌内容进行搜索',
			type: PROPS_TYPES.string,
		},
		optionLabelProp: {
			label: '回填到选择框的 Option 的属性值',
			tip:
				'回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value',
			type: PROPS_TYPES.string,
		},
		placeholder: {
			label: 'placeholder',
			type: PROPS_TYPES.string,
			defaultValue: '请选择',
		},
		showArrow: {
			label: '是否显示下拉小箭头',
			type: PROPS_TYPES.boolean,
		},
		showSearch: {
			label: '使单选模式可搜索',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},

		size: {
			label: '选择框大小',
			type: PROPS_TYPES.enum,
			enumData: ['large', 'small', 'default'],
		},
		tokenSeparators: {
			label: '分隔符',
			tip: '在 tags 和 multiple 模式下自动分词的分隔符',
			type: PROPS_TYPES.stringArray,
		},
		value: {
			label: '指定当前选中的条目',
			type: [
				PROPS_TYPES.string,
				PROPS_TYPES.stringArray,
				PROPS_TYPES.number,
				PROPS_TYPES.numberArray,
			],
		},
		onBlur: {
			label: '失去焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onChange: {
			label: 'input的value变化',
			tip: '选中option，或input的value变化（combobox 模式下）时',
			type: PROPS_TYPES.function,
			placeholder: '(value, option) => {}',
		},
		onDeselect: {
			label: '取消选中时调用',
			tip:
				'取消选中时调用，参数为选中项的 value (或 key) 值，仅在 multiple 或 tags 模式下生效',
			type: PROPS_TYPES.function,
			placeholder: '(param)=>{}',
		},
		onFocus: {
			label: '	获取焦点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		onInputKeyDown: {
			label: '按键按下时回调',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
		onMouseEnter: {
			label: '鼠标移入时回调',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
		onMouseLeave: {
			label: '鼠标移出时回调',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
		onPopupScroll: {
			label: '下拉列表滚动时的回调',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
		onSearch: {
			label: '文本框值变化时回调',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onSelect: {
			label: '被选中时调用',
			type: PROPS_TYPES.function,
			placeholder: '(param, option) => {}',
		},
		defaultOpen: {
			label: '是否默认展开下拉菜单',
			type: PROPS_TYPES.boolean,
		},
		open: {
			label: '是否展开下拉菜单',
			type: PROPS_TYPES.boolean,
		},
		onDropdownVisibleChange: {
			label: '展开下拉菜单的回调',
			type: PROPS_TYPES.function,
			placeholder: '(open)=>{}',
		},
		loading: {
			label: '加载中状态',
			type: PROPS_TYPES.boolean,
		},
	},
}

const OptGroup: ComponentSchemaType = {
	fatherNodesRule: ['Select.children'],
	nodePropsConfig: {
		label: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Select.Option'],
		},
	},
	propsConfig: {
		key: {
			label: 'key',
			type: PROPS_TYPES.string,
		},
		label: {
			label: '组名',
			type: PROPS_TYPES.string,
		},
	},
}
const Option: ComponentSchemaType = {
	fatherNodesRule: ['Select.children', 'Select.OptGroup.children'],
	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		key: {
			label: 'key',
			tip:
				'和 value 含义一致。如果 React 需要你设置此项，此项值与 value 的值相同，然后可以省略 value 设置',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '选中该 Option 后，Select 的 title',
			type: PROPS_TYPES.string,
		},
		value: {
			label: '默认根据此属性值进行筛选',
			type: [PROPS_TYPES.string, PROPS_TYPES.number],
		},
	},
}
export default {
	Select,
	'Select.OptGroup': OptGroup,
	'Select.Option': Option,
}
