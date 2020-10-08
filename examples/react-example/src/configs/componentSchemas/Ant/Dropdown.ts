import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Dropdown: ComponentSchemaType = {
	nodePropsConfig: {
		overlay: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Menu'],
			isOnlyNode: true,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			isOnlyNode: true,
			isRequired: true,
		},
	},
	propsConfig: {
		disabled: {
			label: '菜单是否禁用',
			type: PROPS_TYPES.boolean,
		},
		getPopupContainer: {
			label: '菜单渲染父节点',
			tip:
				'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位',
			type: PROPS_TYPES.function,
			placeholder: '(triggerNode) => document.body',
		},
		overlayClassName: {
			label: '下拉根元素的类名称',
			type: PROPS_TYPES.string,
		},
		overlayStyle: {
			label: '下拉根元素的样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		placement: {
			label: '菜单弹出位置',
			type: PROPS_TYPES.enum,
			enumData: [
				'bottomLeft',
				'bottomCenter',
				'bottomRight',
				'topLeft',
				'topCenter',
				'topRight',
			],
		},
		trigger: {
			label: '触发下拉的行为',
			tip: '触发下拉的行为, 移动端不支持 hover,click|hover|contextMenu',
			type: PROPS_TYPES.stringArray,
		},
		visible: {
			label: '菜单是否显示',
			type: PROPS_TYPES.boolean,
		},
		onVisibleChange: {
			label: '菜单显示状态改变时调用',
			type: PROPS_TYPES.function,
			placeholder: '(visible)=>{}',
		},
	},
}
const Button: ComponentSchemaType = {
	nodePropsConfig: {
		overlay: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Menu'],
		},
		icon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		disabled: {
			label: '菜单是否禁用',
			type: PROPS_TYPES.boolean,
		},
		size: {
			label: '按钮大小',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'large', 'small'],
		},
		type: {
			label: '按钮类型',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'primary', 'dashed', 'danger', 'link'],
		},
		placement: {
			label: '菜单弹出位置',
			type: PROPS_TYPES.enum,
			enumData: [
				'bottomLeft',
				'bottomCenter',
				'bottomRight',
				'topLeft',
				'topCenter',
				'topRight',
			],
		},
		trigger: {
			label: '触发下拉的行为',
			tip: '触发下拉的行为, 移动端不支持 hover,click|hover|contextMenu',
			type: PROPS_TYPES.stringArray,
		},
		visible: {
			label: '菜单是否显示',
			type: PROPS_TYPES.boolean,
		},
		onClick: {
			label: '点击左侧按钮的回调',
			type: PROPS_TYPES.function,
		},
		onVisibleChange: {
			label: '菜单显示状态改变时调用',
			type: PROPS_TYPES.function,
			placeholder: '(visible)=>{}',
		},
	},
}
export default {
	Dropdown,
	'Dropdown.Button': Button,
}
