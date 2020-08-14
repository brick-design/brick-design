import {
	ComponentConfigTypes,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/core';

const p: ComponentConfigTypes = {
	nodePropsConfig: {
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		children: {
			label: '文本内容',
			type: PROPS_TYPES.string,
		},
	},
};

export default p;
