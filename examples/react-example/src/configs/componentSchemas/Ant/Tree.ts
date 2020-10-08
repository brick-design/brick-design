import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Tree: ComponentSchemaType = {
	propsConfig: {
		autoExpandFather: {
			label: '父节点展开',
			tip: '是否自动展开父节点',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		checkable: {
			label: '节点前添加复选框',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		defaultExpandAll: {
			label: '展开所有树节点',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		disabled: {
			label: '禁用树',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		multiple: {
			label: '支持多选',
			tip: '支持点选多个节点（节点本身）',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		onSelect: {
			label: '点击树节点',
			type: PROPS_TYPES.function,
			placeholder: '(selectedKeys, e) => {}',
		},
	},
}

const TreeNode: ComponentSchemaType = {
	propsConfig: {
		autoExpandFather: {
			label: '父节点展开',
			tip: '是否自动展开父节点',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		checkable: {
			label: '节点前添加复选框',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		defaultExpandAll: {
			label: '展开所有树节点',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		disabled: {
			label: '禁用树',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		multiple: {
			label: '支持多选',
			tip: '支持点选多个节点（节点本身）',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		onSelect: {
			label: '点击树节点',
			type: PROPS_TYPES.function,
			placeholder: '(selectedKeys, e) => {}',
		},
	},
}

export default {
	Tree,
	'Tree.TreeNode': TreeNode,
}
