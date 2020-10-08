import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Menu: ComponentSchemaType = {
	nodePropsConfig: {
		overflowedIndicator: {
			type: NODE_PROPS_TYPES.reactNode,
			isOnlyNode: true,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: [
				'Menu.ItemGroup',
				'Menu.Item',
				'Menu.SubMenu',
				'Menu.Divider',
			],
		},
	},
	propsConfig: {
		defaultOpenKeys: {
			label: '初始展开的SubMenu',
			tip: '初始展开的 SubMenu 菜单项 key 数组',
			type: PROPS_TYPES.stringArray,
		},
		defaultSelectedKeys: {
			label: '初始选中的菜单项 key 数组',
			type: PROPS_TYPES.stringArray,
		},
		forceSubMenuRender: {
			label: '在子菜单展示之前就渲染进 DOM',
			type: PROPS_TYPES.boolean,
		},
		inlineCollapsed: {
			label: 'inline 时菜单是否收起状态',
			type: PROPS_TYPES.boolean,
		},
		inlineIndent: {
			label: 'inline 模式的菜单缩进宽度',
			type: PROPS_TYPES.number,
		},
		mode: {
			label: '菜单类型',
			tip: '现在支持垂直、水平、和内嵌模式三种',
			type: PROPS_TYPES.enum,
			enumData: ['vertical', 'vertical-right', 'horizontal', 'inline'],
		},
		multiple: {
			label: '是否允许多选',
			type: PROPS_TYPES.boolean,
		},
		openKeys: {
			label: '当前展开的SubMenu菜单项key数组',
			type: PROPS_TYPES.stringArray,
		},
		selectable: {
			label: '是否允许选中',
			type: PROPS_TYPES.boolean,
		},
		selectedKeys: {
			label: '当前选中的菜单项 key 数组',
			type: PROPS_TYPES.stringArray,
		},
		subMenuCloseDelay: {
			label: '鼠标离开子菜单后关闭延时',
			tip: '鼠标离开子菜单后关闭延时，单位：秒',
			type: PROPS_TYPES.number,
		},
		subMenuOpenDelay: {
			label: '鼠标进入子菜单后开启延时',
			tip: '用户鼠标进入子菜单后开启延时，单位：秒',
			type: PROPS_TYPES.number,
		},

		theme: {
			label: '主题颜色',
			type: PROPS_TYPES.enum,
			enumData: ['light', 'dark'],
		},
		onClick: {
			label: '点击 MenuItem 调用此函数',
			type: PROPS_TYPES.function,
			placeholder: '({ item, key, keyLocation }) => {}',
		},
		onDeselect: {
			label: '取消选中时调用，仅在 multiple 生效',
			type: PROPS_TYPES.function,
			placeholder: '({ item, key, selectedKeys }) => {}',
		},
		onOpenChange: {
			label: 'SubMenu 展开/关闭的回调',
			type: PROPS_TYPES.function,
			placeholder: '(openKeys) => {}',
		},
		onSelect: {
			label: '被选中时调用',
			type: PROPS_TYPES.function,
			placeholder: '({ item, key, selectedKeys }) => {}',
		},
	},
}
const Divider: ComponentSchemaType = {
	propsConfig: {},
}
const ItemGroup: ComponentSchemaType = {
	fatherNodesRule: [
		'Menu.children',
		'Menu.ItemGroup.children',
		'Item',
		'Menu.SubMenu.children',
	],

	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Menu.Item'],
		},
	},
	propsConfig: {
		title: {
			label: '标题内容',
			type: PROPS_TYPES.string,
		},
	},
}
const SubMenu: ComponentSchemaType = {
	fatherNodesRule: [
		'Menu.children',
		'Menu.ItemGroup.children',
		'Item',
		'Menu.SubMenu.children',
	],
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Menu.Item', 'Menu.SubMenu', 'Menu.ItemGroup'],
		},
	},
	propsConfig: {
		title: {
			label: '标题内容',
			type: PROPS_TYPES.string,
		},
		popupClassName: {
			label: '子菜单样式',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		key: {
			label: 'item 的唯一标志',
			type: PROPS_TYPES.string,
		},
		onTitleClick: {
			label: '点击子菜单标题',
			type: PROPS_TYPES.function,
			placeholder: '({ key, domEvent }) => {}',
		},
	},
}
const Item: ComponentSchemaType = {
	fatherNodesRule: [
		'Menu.children',
		'Menu.ItemGroup.children',
		'Item',
		'Menu.SubMenu.children',
	],
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
			label: 'item 的唯一标志',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '设置收缩时展示的悬浮标题',
			type: PROPS_TYPES.string,
		},
	},
}
export default {
	Menu,
	'Menu.Divider': Divider,
	'Menu.ItemGroup': ItemGroup,
	'Menu.SubMenu': SubMenu,
	'Menu.Item': Item,
}
