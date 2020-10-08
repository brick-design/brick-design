import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Avatar: ComponentSchemaType = {
	nodePropsConfig: {
		icon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		icon: {
			label: '设置头像的图标类型',
			tip: '设置头像的图标类型，参考 Icon 组件',
			type: PROPS_TYPES.string,
		},
		shape: {
			label: '指定头像的形状',
			type: PROPS_TYPES.enum,
			enumData: ['circle', 'square'],
			defaultValue: 'circle',
		},

		src: {
			label: '上传图像',
			type: PROPS_TYPES.string,
		},
		alt: {
			label: '替代文本',
			tip: '图像未显示时的替代文本',
			type: PROPS_TYPES.string,
		},
		size: {
			label: '头像大小',
			type: PROPS_TYPES.number,
		},
		onError: {
			label: '图片加载失败的事件',
			tip: '图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为',
			type: PROPS_TYPES.function,
			placeholder: '(boolean) => {}',
		},
	},
}

export default Avatar
