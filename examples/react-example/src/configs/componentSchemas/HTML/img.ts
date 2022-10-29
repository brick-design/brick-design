import { ComponentSchemaType, PROPS_TYPES } from '@brickd/canvas'

const img: ComponentSchemaType = {
	isNonContainer:true,
	propsConfig: {
		alt: {
			label: '图像的替代文本',
			type: PROPS_TYPES.string,
		},
		src: {
			label: '图像链接',
			type: PROPS_TYPES.string,
		},
		height: {
			label: '高度',
			type: PROPS_TYPES.number,
			unit: 'px',
		},
		width: {
			label: '宽度',
			type: PROPS_TYPES.number,
			unit: 'px',
		},
		className: {
			type: PROPS_TYPES.cssClass,
		},
		style:{
			type: PROPS_TYPES.style,
		},
	},
}
export default img
