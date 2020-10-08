import { PROPS_TYPES } from '@brickd/react'

export default {
	propsConfig: {
		affix: {
			label: '延迟时间',
			tip: '延迟显示加载效果的时间（防止闪烁）',
			type: PROPS_TYPES.number,
		},
		size: {
			label: '组件大小',
			type: PROPS_TYPES.enum,
			enumData: ['small', 'default', 'large'],
			defaultValue: 'default',
		},
		spinning: {
			label: '是否为加载中状态	',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		tip: {
			label: '文案',
			tip: '当作为包裹元素时，可以自定义描述文案',
			type: PROPS_TYPES.string,
		},
	},
}
