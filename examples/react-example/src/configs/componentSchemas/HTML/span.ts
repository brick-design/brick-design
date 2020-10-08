import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const span: ComponentSchemaType = {
	propsConfig: {
		children: {
			label: '文本内容',
			type: PROPS_TYPES.string,
		},
	},
}

export default span
