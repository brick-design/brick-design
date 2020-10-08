import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Modal: ComponentSchemaType = {
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		footer: {
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
	},
	propsConfig: {
		afterClose: {
			label: 'Modal关闭回调',
			tip: 'Modal 完全关闭后的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
		footer: {
			label: '弹窗底部',
			type: PROPS_TYPES.string,
		},
		title: {
			label: '标题内容',
			type: PROPS_TYPES.string,
		},
		bodyStyle: {
			label: 'Modal body样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		cancelText: {
			label: '取消按钮文字',
			tip: '取消按钮文字',
			type: PROPS_TYPES.string,
			defaultValue: '取消',
		},
		centered: {
			label: '垂直居中展示',
			tip: '垂直居中展示 Modal',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		closable: {
			label: '显示关闭按钮',
			tip: '是否显示右上角的关闭按钮',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		confirmLoading: {
			label: '按钮loading',
			tip: '确定按钮 loading',
			type: PROPS_TYPES.boolean,
		},
		destroyOnClose: {
			label: '关闭销毁元素',
			tip: '关闭时销毁 Modal 里的子元素',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		getContainer: {
			label: '指定挂载节点',
			tip: '指定 Modal 挂载的 HTML 节点',
			type: PROPS_TYPES.function,
			placeholder: '(HTMLElement) => {}',
		},
		keyboard: {
			label: '键盘esc关闭',
			tip: '是否支持键盘esc关闭',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		mask: {
			label: '是否展示遮罩',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		maskClosable: {
			label: '点击蒙层关闭',
			tip: '点击蒙层是否允许关闭',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		maskStyle: {
			label: '遮罩样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		okText: {
			label: '确认按钮文字',
			type: PROPS_TYPES.string,
			defaultValue: '确定',
		},
		okType: {
			label: '确认按钮类型',
			type: PROPS_TYPES.string,
			defaultValue: 'primary',
		},
		style: {
			label: '设置浮层样式',
			tip: '可用于设置浮层的样式，调整浮层位置等',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		width: {
			label: '宽度',
			tip: '输入数字或者百分数',
			type: PROPS_TYPES.string,
			defaultValue: '520px',
		},
		wrapClassName: {
			label: '外层容器类名',
			tip: '对话框外层容器的类名',
			type: PROPS_TYPES.string,
		},
		zIndex: {
			label: '设置样式层级',
			tip: '设置 Modal 的 z-index',
			type: PROPS_TYPES.number,
			defaultValue: 1000,
		},
		onCancel: {
			label: '取消按钮回调',
			tip: '点击遮罩层或右上角叉或取消按钮的回调',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
		onOk: {
			label: '点击确定回调',
			type: PROPS_TYPES.function,
			placeholder: '(e) => {}',
		},
	},
}

export default Modal
