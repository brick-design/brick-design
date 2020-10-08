import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Layout: ComponentSchemaType = {
	propsConfig: {
		hasSider: {
			label: '子元素是否有sider',
			tip: '表示子元素里有 Sider，一般不用指定。可用于服务端渲染时避免样式闪动',
			type: PROPS_TYPES.boolean,
		},
		className: {
			label: '类名',
			type: PROPS_TYPES.stringArray,
		},
	},
}

const Header: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}
const Footer: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}
const Sider: ComponentSchemaType = {
	nodePropsConfig: {
		trigger: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		trigger: {
			label: 'trigger',
			tip: '自定义 trigger，设置为 null 时隐藏 trigger',
			type: PROPS_TYPES.string,
		},
		breakpoint: {
			label: '断点触发',
			tip: '触发响应式布局的断点',
			type: PROPS_TYPES.enum,
			enumData: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
		},
		collapsed: {
			label: '当前收起状态',
			type: PROPS_TYPES.boolean,
		},
		collapsedWidth: {
			label: '收缩宽度',
			tip: '收缩宽度，设置为 0 会出现特殊 trigger',
			type: PROPS_TYPES.number,
		},
		collapsible: {
			label: '是否可收起',
			type: PROPS_TYPES.boolean,
		},
		defaultCollapsed: {
			label: '是否默认收起',
			type: PROPS_TYPES.boolean,
		},
		reverseArrow: {
			label: '翻转折叠提示箭头的方向',
			tip: '翻转折叠提示箭头的方向，当 Sider 在右边时可以使用',
			type: PROPS_TYPES.boolean,
		},
		theme: {
			label: '主题颜色',
			type: PROPS_TYPES.enum,
			enumData: ['light', 'dark'],
		},

		width: {
			label: '宽度',
			type: PROPS_TYPES.number,
			hasUnit: true,
		},
		onCollapse: {
			label: '收起时的回调函数',
			tip:
				'展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发',
			type: PROPS_TYPES.function,
			placeholder: '(collapsed, type) => {}',
		},
		onBreakpoint: {
			label: '触发响应式布局断点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '(broken) => {}',
		},
		zeroWidthTriggerStyle: {
			label: 'trigger 的样式',
			tip: '指定当 collapsedWidth 为 0 时出现的特殊 trigger 的样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
	},
}
const Content: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}

export default {
	Layout,
	'Layout.Header': Header,
	'Layout.Footer': Footer,
	'Layout.Content': Content,
	'Layout.Sider': Sider,
}
