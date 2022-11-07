import { PROPS_TYPES, PropsConfigType } from '@brickd/core';

export const seniorConfigs:PropsConfigType={
	isFreeLayout:{
		label: '自由布局',
		type:PROPS_TYPES.boolean,
	},
	isStateDomain: {
		type:PROPS_TYPES.boolean,
	},
	state: {
		type:PROPS_TYPES.object,
	},
	propFields:{
		type:PROPS_TYPES.stringArray
	},
	condition: {
		type:PROPS_TYPES.string
	},
	loop: {
		type:PROPS_TYPES.objectArray
	},

	api: {
		type:PROPS_TYPES.objectArray
	}
};
