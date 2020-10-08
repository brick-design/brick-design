import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'
import { TreeSelect as AntTreeSelect } from 'antd'

const TreeSelect: ComponentSchemaType = {
	nodePropsConfig: {
		maxTagPlaceholder: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		suffixIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		allowClear: {
			label: '显示清除按钮',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		autoClearSearchValue: {
			label: '自动清空搜索框',
			tip: '当多选模式下值被选择，自动清空搜索框',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		defaultValue: {
			label: '指定默认选中的条目',
			type: [PROPS_TYPES.string, PROPS_TYPES.stringArray],
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		dropdownClassName: {
			label: '下拉菜单的 className 属性',
			type: PROPS_TYPES.string,
		},
		dropdownMatchSelectWidth: {
			label: '下拉菜单和选择器同宽',
			tip: '下拉菜单和选择器同宽。默认将设置 min-width。',
			type: PROPS_TYPES.boolean,
		},
		dropdownStyle: {
			label: '下拉菜单的样式',
			type: [PROPS_TYPES.json, PROPS_TYPES.objectArray],
			childPropsConfig: {},
		},
		filterTreeNode: {
			label: '是否根据输入项进行筛选',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.function],
			placeholder: '(inputValue, treeNode)=>true',
		},
		getPopupContainer: {
			label: '菜单渲染父节点',
			tip:
				'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。',
			type: PROPS_TYPES.function,
			placeholder: '() => document.body',
		},
		labelInValue: {
			label: '是否把每个选项的 label 包装到 value 中',
			tip:
				'是否把每个选项的 label 包装到 value 中，会把 value 类型从 string 变为 {value: string, label: ReactNode, halfChecked(treeCheckStrictly 时有效): string[] } 的格式',
			type: PROPS_TYPES.boolean,
		},
		loadData: {
			label: '异步加载数据',
			type: PROPS_TYPES.function,
			placeholder: '(node)=>{}',
		},
		maxTagCount: {
			label: '最大tag数',
			tip: '最多显示多少个 tag',
			type: PROPS_TYPES.number,
		},
		maxTagPlaceholder: {
			label: '隐藏 tag 时显示的内容',
			type: PROPS_TYPES.function,
			placeholder: '(omittedValues)=>{}',
		},
		multiple: {
			label: '支持多选',
			tip: '支持多选（当设置 treeCheckable 时自动变为true）',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		placeholder: {
			label: '选择框默认文字',
			type: PROPS_TYPES.string,
		},
		searchPlaceholder: {
			label: '搜索框默认文字',
			type: PROPS_TYPES.string,
		},
		searchValue: {
			label: '搜索框的值',
			tip: '搜索框的值，可以通过 onSearch 获取用户输入',
			type: PROPS_TYPES.string,
		},

		treeIcon: {
			label: '是否展示 TreeNode title 前的图标',
			tip:
				'是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式',
			type: PROPS_TYPES.boolean,
		},
		showCheckedStrategy: {
			label: '定义选中项回填的方式',
			tip:
				'定义选中项回填的方式。TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点). TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时). 默认只显示子节点.',
			type: PROPS_TYPES.enum,
			enumData: [
				AntTreeSelect.SHOW_ALL,
				AntTreeSelect.SHOW_CHILD,
				AntTreeSelect.SHOW_PARENT,
			],
		},
		showSearch: {
			label: '显示搜索框',
			tip: '在下拉中显示搜索框(仅在单选模式下生效)',
			type: PROPS_TYPES.boolean,
		},

		size: {
			label: '选择框大小',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'small', 'large'],
		},
		treeCheckable: {
			label: '显示 checkbox',
			type: PROPS_TYPES.boolean,
		},
		treeCheckStrictly: {
			label: 'treeCheckStrictly',
			tip:
				'checkable 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 labelInValue 强制为 true',
			type: PROPS_TYPES.boolean,
		},
		treeData: {
			label: 'treeNodes 数据',
			tip:
				'treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一）',
			type: PROPS_TYPES.objectArray,
			childPropsConfig: [{}],
		},
		treeDataSimpleMode: {
			label: 'treeDataSimpleMode',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {},
		},
		treeDefaultExpandAll: {
			label: '树节点展开',
			tip: '默认展开所有树节点',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		treeDefaultExpandedKeys: {
			label: '默认展开的树节点',
			type: PROPS_TYPES.stringArray,
		},
		treeExpandedKeys: {
			label: '设置展开的树节点',
			type: PROPS_TYPES.stringArray,
		},
		treeNodeFilterProp: {
			label: '输入项过滤对应的 treeNode 属性',
			type: PROPS_TYPES.string,
		},
		treeNodeLabelProp: {
			label: '作为显示的 prop 设置',
			type: PROPS_TYPES.string,
		},
		value: {
			label: '指定当前选中的条目',
			type: [PROPS_TYPES.string, PROPS_TYPES.stringArray],
		},
		onChange: {
			label: '选中节点函数',
			tip: '选中树节点时调用此函数',
			type: PROPS_TYPES.function,
			placeholder: '(value, label, extra) => {}',
		},
		onSearch: {
			label: '数值变化函数',
			tip: '文本框值变化时回调函数名称',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onSelect: {
			label: '被选中函数',
			type: PROPS_TYPES.function,
			placeholder: '(value, node, extra) => {}',
		},
		onTreeExpand: {
			label: '展示节点时调用',
			type: PROPS_TYPES.function,
			placeholder: '(expandedKeys)=>{}',
		},
	},
}

const TreeNode: ComponentSchemaType = {
	fatherNodesRule: ['TreeSelect.children'],
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		selectable: {
			label: '是否可选',
			type: PROPS_TYPES.boolean,
		},
		checkable: {
			label: 'checkable',
			tip: '当树为 checkable 时，设置独立节点是否展示 Checkbox',
			type: PROPS_TYPES.boolean,
		},
		disableCheckbox: {
			label: '禁掉 checkbox',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		isLeaf: {
			label: '是否是叶子节点',
			type: PROPS_TYPES.boolean,
		},
		key: {
			label: 'key',
			tip: '此项必须设置（其值在整个树范围内唯一）',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '树节点显示的内容',
			type: PROPS_TYPES.string,
		},
		value: {
			label: 'value',
			tip: '默认根据此属性值进行筛选（其值在整个树范围内唯一）',
			type: PROPS_TYPES.string,
		},
	},
}
export default {
	TreeSelect,
	'TreeSelect.TreeNode': TreeNode,
}
