import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Carousel: ComponentSchemaType = {
	propsConfig: {
		afterChange: {
			label: '切换面板后的回调',
			type: PROPS_TYPES.function,
			placeholder: '(current) => {}',
		},
		autoplay: {
			label: '自动切换',
			type: PROPS_TYPES.boolean,
		},
		beforeChange: {
			label: '切换面板前的回调',
			type: PROPS_TYPES.function,
			placeholder: '(from, to) => {}',
		},
		dots: {
			label: '显示面板指示点',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		easing: {
			label: '动画效果',
			type: PROPS_TYPES.enum,
			enumData: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
			defaultValue: 'linear',
		},
		effect: {
			label: '动画效果函数',
			type: PROPS_TYPES.enum,
			enumData: ['scrollx', 'fade'],
			defaultValue: 'scrollx',
		},
		vertical: {
			label: '垂直显示',
			type: PROPS_TYPES.boolean,
		},
	},
}

export default Carousel
