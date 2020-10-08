import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Drawer: ComponentSchemaType = {
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	mirrorModalField: {
		displayPropName: 'visible',
		mounted: {
			propName: 'getContainer',
			type: PROPS_TYPES.function,
		},
		style: { position: 'absolute' },
	},
	propsConfig: {
		closable: {
			label: '是否显示按钮',
			tip: '是否显示右上角的关闭按钮',
			type: PROPS_TYPES.boolean,
		},
		destroyOnClose: {
			label: '销毁子元素',
			tip: '关闭时销毁 Drawer 里的子元素',
			type: PROPS_TYPES.boolean,
		},
		maskClosable: {
			label: '是否允许关闭',
			tip: '点击蒙层是否允许关闭',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		mask: {
			label: '是否展示遮罩',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		maskStyle: {
			label: '遮罩样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		style: {
			label: 'Drawer 的样式',
			tip: '可用于设置 Drawer 的样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		title: {
			label: '标题',
			type: PROPS_TYPES.string,
		},
		visible: {
			label: '是否可见',
			tip: 'Drawer 是否可见',
			type: PROPS_TYPES.boolean,
		},
		width: {
			label: '宽度',
			type: PROPS_TYPES.string,
		},
		height: {
			label: '高度',
			tip: '高度, 在 抽屉的方向 为 top 或 bottom 时使用',
			type: PROPS_TYPES.string,
		},
		zIndex: {
			label: 'z-index',
			tip: '设置 Drawer 的 z-index',
			type: PROPS_TYPES.number,
		},
		placement: {
			label: '抽屉的方向',
			type: PROPS_TYPES.enum,
			enumData: ['top', 'right', 'bottom', 'left'],
			defaultValue: 'left',
		},
		onClose: {
			label: 'onClose',
			tip: '点击遮罩层或右上角叉或取消按钮的回调',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
	},
}

export default Drawer
