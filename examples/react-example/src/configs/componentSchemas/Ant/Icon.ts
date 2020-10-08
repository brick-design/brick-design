import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Icon: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		type: {
			label: '图标类型',
			tip: '图标类型。遵循图标的命名规范',
			type: PROPS_TYPES.string,
		},
		style: {
			label: '图标样式',
			tip: '设置图标的样式，例如 fontSize 和 color',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		theme: {
			label: '图标风格',
			tip: '图标主题风格',
			type: PROPS_TYPES.enum,
			enumData: ['filled', 'outlined', 'twoTone'],
		},
		spin: {
			label: '旋转动画',
			tip: '是否有旋转动画',
			type: PROPS_TYPES.boolean,
		},
		rotate: {
			label: '图标旋转角度',
			tip: '图标旋转角度（3.13.0 后新增，IE9 无效）',
			type: PROPS_TYPES.number,
		},
		twoToneColor: {
			label: '双色图标颜色',
			tip: '仅适用双色图标。设置双色图标的主要颜色',
			type: PROPS_TYPES.string,
			isShowColor: true,
		},
	},
}

export default Icon
