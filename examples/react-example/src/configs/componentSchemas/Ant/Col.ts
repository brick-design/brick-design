import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const DEFAULT_CONFIG = {
	span: {
		label: '占位',
		type: PROPS_TYPES.number,
	},
	offset: {
		label: '偏移量',
		type: PROPS_TYPES.number,
	},
}

const Col: ComponentSchemaType = {
	propsConfig: {
		offset: {
			label: '间隔格数',
			tip: '栅格左侧的间隔格数，间隔内不可以有栅格',
			type: PROPS_TYPES.number,
		},
		order: {
			label: '栅格顺序',
			tip: '栅格顺序，flex 布局模式下有效',
			type: PROPS_TYPES.number,
		},
		pull: {
			label: '左移动格数',
			tip: '栅格向左移动格数',
			type: PROPS_TYPES.number,
		},
		push: {
			label: '右移动格数',
			tip: '栅格向右移动格数',
			type: PROPS_TYPES.number,
		},
		span: {
			label: '占位格数',
			tip: '栅格占位格数，为 0 时相当于 display: none',
			type: PROPS_TYPES.number,
		},
		xs: {
			label: 'xs',
			tip: '<576px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
		sm: {
			label: 'sm',
			tip: '<576px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
		md: {
			label: 'md',
			tip: '≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
		lg: {
			label: 'lg',
			tip: '≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
		xl: {
			label: 'xl',
			tip: '≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
		xxl: {
			label: 'xxl',
			tip: '≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象',
			type: [PROPS_TYPES.number, PROPS_TYPES.object],
			childPropsConfig: {
				...DEFAULT_CONFIG,
			},
		},
	},
}

export default Col
