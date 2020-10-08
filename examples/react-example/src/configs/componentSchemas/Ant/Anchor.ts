import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Anchor: ComponentSchemaType = {
	nodePropsConfig: {
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Anchor.Link'],
		},
	},
	propsConfig: {
		affix: {
			label: '固定模式',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		bounds: {
			label: '锚点区域边界',
			type: PROPS_TYPES.number,
			defaultValue: 5,
		},
		offsetBottom: {
			label: '距底部距离',
			tip: '距离窗口底部达到指定偏移量后触发',
			type: PROPS_TYPES.number,
		},
		offsetTop: {
			label: '距顶部距离',
			tip: '距离窗口顶部达到指定偏移量后触发',
			type: PROPS_TYPES.number,
		},
		onClick: {
			label: '点击事件',
			type: PROPS_TYPES.function,
			placeholder: '(e, link) => {}',
		},
	},
}
const Link: ComponentSchemaType = {
	fatherNodesRule: ['Anchor', 'Anchor.Link.children'],
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			childNodesRule: ['Anchor.Link'],
		},
	},
	propsConfig: {
		href: {
			label: '锚点链接',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '文字内容',
			type: PROPS_TYPES.string,
		},
		target: {
			label: '该属性指定在何处显示链接的资源',
			type: PROPS_TYPES.string,
		},
	},
}

export default {
	Anchor,
	'Anchor.Link': Link,
}
