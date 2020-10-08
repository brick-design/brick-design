import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Row: ComponentSchemaType = {
	propsConfig: {
		align: {
			label: '垂直对齐方式',
			tip: 'flex 布局下的垂直对齐方式：top middle bottom',
			type: PROPS_TYPES.enum,
			enumData: ['top', 'middle', 'bottom'],
		},
		gutter: {
			label: '栅格间隔',
			tip:
				'栅格间隔，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24}',
			type: [PROPS_TYPES.number, PROPS_TYPES.object, PROPS_TYPES.numberArray],
			childPropsConfig: {
				xs: {
					label: 'xs',
					type: PROPS_TYPES.number,
				},
				sm: {
					label: 'sm',
					type: PROPS_TYPES.number,
				},
				md: {
					label: 'md',
					type: PROPS_TYPES.number,
				},
				lg: {
					label: 'lg',
					type: PROPS_TYPES.number,
				},
				xl: {
					label: 'xl',
					type: PROPS_TYPES.number,
				},
				xxl: {
					label: 'xxl',
					type: PROPS_TYPES.number,
				},
			},
		},
		justify: {
			label: '水平排列方式',
			tip:
				'flex 布局下的水平排列方式：start end center space-around space-between',
			type: PROPS_TYPES.enum,
			enumData: ['start', 'end', 'center', 'space-around', 'space-between'],
		},

		type: {
			label: '布局模式',
			tip: '布局模式，可选 flex，现代浏览器 下有效',
			type: PROPS_TYPES.enum,
			enumData: ['flex'],
		},
	},
}
export default Row
