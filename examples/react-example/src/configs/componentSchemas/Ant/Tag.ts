import { ComponentSchemaType, PROPS_TYPES } from '@brickd/canvas'

const Tag: ComponentSchemaType = {
	propsConfig: {
		color: {
			label: '标签色',
			type: PROPS_TYPES.string,
		},
	},
}

export default Tag
