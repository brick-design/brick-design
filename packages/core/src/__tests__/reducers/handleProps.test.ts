import { merge } from 'lodash';
import { reducer } from '../../reducers';
import { LEGO_BRIDGE, legoState } from '../../store';
import ACTION_TYPES from '../../actions/actionTypes';
import config from '../configs';

import {
	PageConfigType,
	PROPS_TYPES,
	PropsConfigSheetType,
	SelectedInfoType,
	StateType,
} from '../../types';
import {
	AddPropsConfigPayload,
	ChangePropsPayload,
	DeletePropsConfigPayload,
} from '../../actions';
import { getComponentConfig, ROOT } from '../../utils';

beforeAll(() => {
	LEGO_BRIDGE.config = config;
	console.warn = jest.fn();
});
describe('addPropsConfig', () => {
	const action = { type: ACTION_TYPES.addPropsConfig };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});

	it('添加object属性配置', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'a' },
		};
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			parentKey: '',
			domTreeKeys: [],
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			propsConfigSheet: {},
			selectedInfo,
		};
		const payload: AddPropsConfigPayload = {
			fatherFieldLocation: 'a.childPropsConfig.b.childPropsConfig',
			newPropField: 'c',
			propType: PROPS_TYPES.number,
		};

		const state = reducer(prevState, { ...action, payload });
		const { propsConfig } = getComponentConfig('a');
		const newA = {
			a: {
				childPropsConfig: {
					b: {
						childPropsConfig: {
							c: {
								type: PROPS_TYPES.number,
								isAdd: true,
							},
						},
					},
				},
			},
		};
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo, propsConfigSheet: {} }],
			selectedInfo: {
				...selectedInfo,
				propsConfig: merge({}, propsConfig, newA),
			},
			propsConfigSheet: {
				[ROOT]: newA,
			},
		};
		expect(state).toEqual(expectState);
	});
	it('添加object重复属性配置', () => {
		const propsConfigSheet: PropsConfigSheetType = {
			[ROOT]: {
				a: {
					childPropsConfig: {
						b: {
							type: PROPS_TYPES.objectArray,
						},
					},
				},
			},
		};
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			parentKey: '',
			domTreeKeys: [],
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			propsConfigSheet,
			selectedInfo,
		};
		const payload: AddPropsConfigPayload = {
			fatherFieldLocation: 'a.childPropsConfig',
			newPropField: 'b',
			propType: PROPS_TYPES.object,
		};

		const state = reducer(prevState, { ...action, payload });
		expect(state).toEqual(prevState);
	});
	it('属性根中添加任意属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			parentKey: '',
			domTreeKeys: [],
		};
		const prevState: StateType = {
			...legoState,
			pageConfig: { [ROOT]: { componentName: 'a' } },
			undo: [],
			selectedInfo,
		};
		const payload: AddPropsConfigPayload = {
			fatherFieldLocation: '',
			newPropField: 'a',
			propType: PROPS_TYPES.object,
		};

		const state = reducer(prevState, { ...action, payload });
		const { propsConfig } = getComponentConfig('a');
		const newA = { type: PROPS_TYPES.object, isAdd: true };
		const expectState: StateType = {
			...prevState,
			undo: [{ propsConfigSheet: {}, selectedInfo }],
			propsConfigSheet: {
				[ROOT]: {
					a: newA,
				},
			},
			selectedInfo: {
				...selectedInfo,
				propsConfig: { ...propsConfig, a: newA },
			},
		};
		expect(state).toEqual(expectState);
	});
	it('属性根中添加重复属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			parentKey: '',
			domTreeKeys: [],
			propsConfig: {},
		};
		const prevState: StateType = {
			...legoState,
			selectedInfo,
			propsConfigSheet: { [ROOT]: { a: { type: PROPS_TYPES.string } } },
		};
		const payload: AddPropsConfigPayload = {
			fatherFieldLocation: '',
			newPropField: 'a',
			propType: PROPS_TYPES.object,
		};

		const state = reducer(prevState, { ...action, payload });

		expect(state).toEqual(prevState);
	});
	it('添加objectArray属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			parentKey: '',
			domTreeKeys: [],
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			propsConfigSheet: {},
			pageConfig: { [ROOT]: { componentName: 'a' } },
			selectedInfo,
		};
		const payload: AddPropsConfigPayload = {
			fatherFieldLocation: 'a.childPropsConfig.b.childPropsConfig',
			childPropsConfig: [
				{
					c: {
						type: PROPS_TYPES.number,
						isAdd: true,
					},
				},
			],
		};

		const state = reducer(prevState, { ...action, payload });
		const newA = {
			a: {
				childPropsConfig: {
					b: {
						childPropsConfig: [
							{
								c: {
									type: PROPS_TYPES.number,
									isAdd: true,
								},
							},
						],
					},
				},
			},
		};
		const { propsConfig } = getComponentConfig('a');
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo, propsConfigSheet: {} }],
			selectedInfo: {
				...selectedInfo,
				propsConfig: merge({}, propsConfig, newA),
			},
			propsConfigSheet: {
				[ROOT]: newA,
			},
		};
		expect(state).toEqual(expectState);
	});
});

describe('deletePropsConfig', () => {
	const action = { type: ACTION_TYPES.deletePropsConfig };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});

	it('props有值，删除属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: '1',
			domTreeKeys: [ROOT, '1'],
			parentKey: ROOT,
			propsConfig: {},
		};
		const pageConfig: PageConfigType = {
			[ROOT]: {
				componentName: 'a',
				childNodes: ['1'],
			},
			1: {
				componentName: 'img',
				props: { a: { b: '1' } },
			},
		};
		const propsConfigSheet: PropsConfigSheetType = {
			1: { a: { childPropsConfig: { b: { type: PROPS_TYPES.string } } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			propsConfigSheet,
			selectedInfo,
		};
		const payload: DeletePropsConfigPayload = {
			fatherFieldLocation: 'a.childPropsConfig',
			field: 'b',
		};
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo, pageConfig, propsConfigSheet }],
			pageConfig: {
				...pageConfig,
				1: { componentName: 'img', props: {} },
			},
			propsConfigSheet: {
				1: { a: {} },
			},
			selectedInfo: {
				...selectedInfo,
				propsConfig: merge({}, getComponentConfig('img').propsConfig, {
					a: {},
				}),
			},
		};
		expect(state).toEqual(expectState);
	});
	it('props没有值，删除属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			domTreeKeys: [],
			parentKey: '',
			propsConfig: {},
		};
		const pageConfig: PageConfigType = {
			[ROOT]: {
				componentName: 'img',
				props: {},
			},
		};
		const propsConfigSheet: PropsConfigSheetType = {
			[ROOT]: { a: { childPropsConfig: { b: { type: PROPS_TYPES.string } } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			propsConfigSheet,
			selectedInfo,
		};
		const payload: DeletePropsConfigPayload = {
			fatherFieldLocation: 'a.childPropsConfig',
			field: 'b',
		};
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo, pageConfig, propsConfigSheet }],
			propsConfigSheet: {
				[ROOT]: { a: {} },
			},
			selectedInfo: {
				...selectedInfo,
				propsConfig: merge(config.componentSchemasMap['img'].propsConfig, {
					a: {},
				}),
			},
		};
		expect(state).toEqual(expectState);
	});
	it('删除props根的属性配置', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			domTreeKeys: [ROOT],
			parentKey: '',
			propsConfig: {},
		};
		const pageConfig: PageConfigType = {
			[ROOT]: {
				componentName: 'img',
				props: { a: { b: '1' } },
			},
		};
		const propsConfigSheet: PropsConfigSheetType = {
			[ROOT]: { a: { childPropsConfig: { b: { type: PROPS_TYPES.string } } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			propsConfigSheet,
			selectedInfo,
		};
		const payload: DeletePropsConfigPayload = {
			fatherFieldLocation: '',
			field: 'a',
		};
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo, pageConfig, propsConfigSheet }],
			pageConfig: {
				[ROOT]: { componentName: 'img' },
			},
			propsConfigSheet: {
				[ROOT]: {},
			},
			selectedInfo: {
				...selectedInfo,
				propsConfig: getComponentConfig('img').propsConfig,
			},
		};
		expect(state).toEqual(expectState);
	});
});

describe('changeProps', () => {
	const action = { type: ACTION_TYPES.changeProps };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});
	it('changeProps and style===undefined', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'img', props: { a: 1 } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
		};
		const payload: ChangePropsPayload = { props: { b: 2 } };
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: { componentName: 'img', props: { b: 2 } },
			},
		};

		expect(state).toEqual(expectState);
	});
	it('changeProps and style', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'img', props: { style: { a: 1 } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
		};
		const payload: ChangePropsPayload = { props: { b: 2 } };
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: { componentName: 'img', props: { b: 2, style: { a: 1 } } },
			},
		};

		expect(state).toEqual(expectState);
	});
});

describe('resetProps', () => {
	const action = { type: ACTION_TYPES.resetProps };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});
	it('selectedInfo!==null and style===undefined', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'img', props: { a: 3 } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [],
				parentKey: '',
				propsConfig: {},
				props: { b: 2 },
			},
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: { componentName: 'img', props: { b: 2 } },
			},
		};
		expect(state).toEqual(expectState);
	});
	it('selectedInfo!==null and style!==undefined', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'img', props: { a: 1, style: { c: 3 } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			pageConfig,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [],
				parentKey: '',
				propsConfig: {},
				props: { b: 2 },
			},
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: { componentName: 'img', props: { b: 2, style: { c: 3 } } },
			},
		};
		expect(state).toEqual(expectState);
	});
});
