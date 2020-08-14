import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import { SelectedInfoType, StateType } from '../../types';
import config from '../configs';
import { SelectComponentPayload } from '../../actions';
import { ROOT } from '../../utils';

jest.resetModules();
beforeAll(() => {
	LEGO_BRIDGE.config = config;
});
afterAll(() => {
	LEGO_BRIDGE.config = undefined;
});
describe('selectInfo', () => {
	const action = { type: ACTION_TYPES.selectComponent };
	test('如果 selectedInfo===null ', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
					childNodes: {
						children: ['1'],
					},
				},
			},
		};
		const payload: SelectComponentPayload = {
			key: ROOT,
			parentKey: '',
			domTreeKeys: [ROOT],
			propName: 'test',
		};

		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			selectedInfo: {
				selectedKey: ROOT,
				propsConfig: config.AllComponentConfigs['span'].propsConfig,
				propName: 'test',
				domTreeKeys: [ROOT, '0test'],
				parentKey: '',
			},
		};
		expect(state).toEqual(expectState);
	});
	test('选中没有属性节点的组件组件', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			domTreeKeys: [ROOT, '0test'],
			parentKey: '',
			propsConfig: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			selectedInfo,
			dropTarget: { selectedKey: '', domTreeKeys: [] },
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
					childNodes: {
						test: ['1'],
					},
				},
				1: { componentName: 'img' },
			},
		};
		const payload: SelectComponentPayload = {
			key: '1',
			parentKey: ROOT,
			domTreeKeys: [ROOT, '0test', '1'],
			parentPropName: 'test',
		};
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo }],
			dropTarget: null,
			selectedInfo: {
				selectedKey: '1',
				parentKey: ROOT,
				domTreeKeys: [ROOT, '0test', '1'],
				parentPropName: 'test',
				propsConfig: config!.AllComponentConfigs['img'].propsConfig,
			},
		};
		expect(state).toEqual(expectState);
	});

	test('选中有属性节点的组件', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: '1',
			domTreeKeys: [ROOT, '1'],
			parentKey: ROOT,
			propsConfig: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			selectedInfo,
			dropTarget: { selectedKey: '', domTreeKeys: [] },
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
					childNodes: {
						test: ['1'],
					},
				},
				1: { componentName: 'img' },
			},
		};
		const payload: SelectComponentPayload = {
			key: ROOT,
			parentKey: '',
			domTreeKeys: [ROOT],
			propName: 'children',
		};
		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			undo: [{ selectedInfo }],
			dropTarget: null,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT, '0children'],
				propName: 'children',
				parentKey: '',
				propsConfig: LEGO_BRIDGE.config!.AllComponentConfigs['span']
					.propsConfig,
			},
		};
		expect(state).toEqual(expectState);
	});
	test('如果 selectedInfo.selectedKey===key propName非空 ', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				propName: 'children',
				parentKey: '',
				propsConfig: {},
			},
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
				},
			},
		};
		const payload: SelectComponentPayload = {
			key: ROOT,
			parentKey: '',
			domTreeKeys: [ROOT],
			propName: 'test',
		};

		const state = reducer(prevState, { ...action, payload });
		expect(state).toBe(prevState);
	});
	test(
		'如果 selectedInfo.selectedKey===key selectedInfo.propName!==undefined ' +
			'propName===undefined 说明为选中组件跨组件拖拽嵌套',
		() => {
			const selectedInfo: SelectedInfoType = {
				selectedKey: ROOT,
				domTreeKeys: [ROOT, '0children'],
				propName: 'children',
				parentKey: '',
				propsConfig: {},
			};

			const prevState: StateType = {
				...legoState,
				selectedInfo,
				componentConfigs: {
					[ROOT]: {
						componentName: 'span',
						childNodes: {
							children: ['1'],
						},
					},
				},
			};
			const payload: SelectComponentPayload = {
				key: ROOT,
				parentKey: 'testKey',
				domTreeKeys: [ROOT],
			};

			const state = reducer(prevState, { ...action, payload });
			const expectState: StateType = {
				...prevState,
				selectedInfo: {
					...selectedInfo,
					parentKey: 'testKey',
				},
			};
			expect(state).toEqual(expectState);
		},
	);
	test('如果 selectedInfo.selectedKey===key 并且属性节点不同', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			domTreeKeys: [ROOT, '0children'],
			propName: 'children',
			parentKey: '',
			propsConfig: {},
		};
		const prevState: StateType = {
			...legoState,
			selectedInfo,
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
					childNodes: {
						children: ['1'],
					},
				},
			},
		};
		const payload: SelectComponentPayload = {
			key: ROOT,
			parentKey: '',
			domTreeKeys: [ROOT],
			propName: 'test',
		};

		const state = reducer(prevState, { ...action, payload });
		const expectState: StateType = {
			...prevState,
			selectedInfo: {
				...selectedInfo,
				propName: 'test',
				domTreeKeys: [ROOT, '0test'],
			},
		};
		expect(state).toEqual(expectState);
	});
});

describe('清除选中', () => {
	const action = { type: ACTION_TYPES.clearSelectedStatus };
	test('当没有选中组件时', () => {
		const state = reducer(legoState, action);
		expect(state).toEqual(legoState);
	});

	test('当选中组件的属性节点为必填非空组件时', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				propName: 'children',
				parentKey: '',
				propsConfig: {},
			},
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
				},
			},
		};
		const state = reducer(prevState, action);
		expect(state).toEqual(prevState);
	});
	test('当选中组件的children为必填非空组件时', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			componentConfigs: {
				[ROOT]: {
					componentName: 'h',
				},
			},
		};
		const state = reducer(prevState, action);
		expect(state).toEqual(prevState);
	});
	test('正常清除', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			componentConfigs: {
				[ROOT]: {
					componentName: 'img',
				},
			},
		};
		const state = reducer(prevState, action);
		expect(state.selectedInfo).toBeNull();
	});
});
