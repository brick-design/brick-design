import { ComponentSchemaType, PROPS_TYPES } from '@brickd/canvas'

const div: ComponentSchemaType = {
	propsConfig: {
		children: {
			label: '文本内容',
			type: PROPS_TYPES.string,
		},
		className: {
			type: PROPS_TYPES.cssClass,
		},
		style:{
			type: PROPS_TYPES.style,
		},
	},
}

export default div
