import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import {
	BrickAction,
	ComponentConfigsType,
	PropsConfigSheetType,
	SelectedInfoType,
	StateType,
	UndoRedoType,
} from '../../types';
import config from '../configs';
import { ROOT } from '../../utils';
import { LayoutSortPayload } from '../../actions';

jest.resetModules();
beforeAll(() => {
	LEGO_BRIDGE.config = config;
	console.warn = jest.fn();
});
afterAll(() => {
	LEGO_BRIDGE.config = undefined;
});
describe('addComponent', () => {
	const action: BrickAction = { type: ACTION_TYPES.addComponent };
	test('dragSource===null没有拖拽组件时', () => {
		const state = reducer(legoState, action);
		expect(state).toBe(legoState);
	});
	test('dropTarget===null&&selectedInfo===null 既没有drop目标也没有选中组件时', () => {
		const undo: UndoRedoType[] = [
			{
				componentConfigs: {
					[ROOT]: {
						componentName: 'img',
					},
				},
			},
		];
		const prevState: StateType = {
			...legoState,
			undo,
			componentConfigs: {
				[ROOT]: {
					componentName: 'img',
				},
				1: { componentName: 'a' },
			},
			dragSource: { dragKey: '1', parentKey: '', vDOMCollection: {} },
			dropTarget: null,
		};
		const state = reducer(prevState, action);
		const expectState = {
			...prevState,
			componentConfigs: {
				[ROOT]: {
					componentName: 'img',
				},
			},
			dragSource: null,
		};
		expect(state).toEqual(expectState);
	});
	test('parentKey===selectedKey拖拽的组件是drop目标的子组件', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				[ROOT]: { componentName: 'div' },
			},
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			dragSource: { parentKey: ROOT, dragKey: '1' },
		};
		const state = reducer(prevState, action);
		expect(state).toEqual({ ...prevState, dragSource: null, dropTarget: null });
	});
	test('domTreeKeys.includes(dragKey) 拖拽组件是drop目标的父组件', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: { [ROOT]: { componentName: 'h' } },
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT, '1'],
				parentKey: '',
				propsConfig: {},
			},
			dragSource: { parentKey: '2', dragKey: '1' },
		};
		const state = reducer(prevState, action);
		expect(state).toEqual({ ...prevState, dragSource: null, dropTarget: null });
	});
	test('componentConfigs.0===undefined 没有根节点时', () => {
		const vDOMCollection: ComponentConfigsType = {
			[ROOT]: { componentName: 'a' },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			dragSource: {
				dragKey: ROOT,
				vDOMCollection,
				parentKey: '',
			},
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...legoState,
			componentConfigs: vDOMCollection,
			undo: [{ componentConfigs: {} }],
			dragSource: null,
		};
		expect(state).toEqual(expectState);
	});
	test('componentConfigs.0 有根节点但没有drop目标时', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				[ROOT]: { componentName: 'div' },
			},
			dragSource: {
				dragKey: ROOT,
				parentKey: 'w',
			},
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			dragSource: null,
		};
		expect(state).toEqual(expectState);
	});
	describe('父组件约束限制', () => {
		it('当选中的组件没有属性节点时', () => {
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'a',
					},
					'1': {
						componentName: 'div',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
			};
			expect(reducer(prevState, action)).toEqual({
				...prevState,
				dropTarget: null,
				dragSource: null,
			});
		});
		it('当选中的组件有属性节点时', () => {
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'p',
					},
					'1': {
						componentName: 'div',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: {
					selectedKey: ROOT,
					propName: 'children',
					domTreeKeys: [],
				},
			};
			expect(reducer(prevState, action)).toEqual({
				...prevState,
				dropTarget: null,
				dragSource: null,
			});
		});
		it('当选中的组件有属性节点时', () => {
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'p',
					},
					'1': {
						componentName: 'div',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: {
					selectedKey: ROOT,
					propName: 'children',
					domTreeKeys: [],
				},
			};
			expect(reducer(prevState, action)).toEqual({
				...prevState,
				dropTarget: null,
				dragSource: null,
			});
		});
		it('errorCallback错误回调函数', function () {
			LEGO_BRIDGE.config!.warn = jest.fn();
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'p',
					},
					'1': {
						componentName: 'div',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: {
					selectedKey: ROOT,
					propName: 'children',
					domTreeKeys: [],
				},
			};
			reducer(prevState, action);
			expect(LEGO_BRIDGE.config!.warn).toBeCalled();
			LEGO_BRIDGE.config!.warn = undefined;
		});
	});

	describe('子组件约束限制', () => {
		test('子组件约束限制', () => {
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'span',
					},
					'1': {
						componentName: 'img',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: { selectedKey: ROOT, propName: 'test', domTreeKeys: [] },
			};
			expect(reducer(prevState, action)).toEqual({
				...prevState,
				dropTarget: null,
				dragSource: null,
			});
		});
		test('没有属性节点配置的子组件约束限制', () => {
			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'h',
					},
					'1': {
						componentName: 'a',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
			};
			expect(reducer(prevState, action)).toEqual({
				...prevState,
				dropTarget: null,
				dragSource: null,
			});
		});
		test('warn', () => {
			LEGO_BRIDGE.config!.warn = jest.fn();

			const prevState: StateType = {
				...legoState,
				componentConfigs: {
					[ROOT]: {
						componentName: 'span',
					},
					'1': {
						componentName: 'img',
					},
				},
				dragSource: { dragKey: '1', parentKey: '' },
				dropTarget: { selectedKey: ROOT, propName: 'test', domTreeKeys: [] },
			};
			reducer(prevState, action);
			expect(LEGO_BRIDGE.config!.warn).toBeCalled();
			LEGO_BRIDGE.config!.warn = undefined;
		});
	});
	test('正常添加新组件', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'div' },
			1: { componentName: 'span' },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			dropTarget: {
				selectedKey: ROOT,
				propName: 'children',
				domTreeKeys: [ROOT],
			},
			dragSource: { dragKey: '1', parentKey: '' },
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			componentConfigs: {
				[ROOT]: { componentName: 'div', childNodes: { children: ['1'] } },
				1: { componentName: 'span' },
			},
			dragSource: null,
			dropTarget: null,
		};
		expect(state).toEqual(expectState);
	});

	test('跨容器拖拽设计面板中的组件', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'div', childNodes: { children: ['1'] } },
			1: { componentName: 'a', childNodes: ['2'] },
			2: { componentName: 'img' },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			dragSource: { dragKey: '2', parentKey: '1' },
			dropTarget: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				propName: 'children',
			},
		};
		const state = reducer(prevState, action);
		const expectComponentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'div', childNodes: { children: ['1', '2'] } },
			1: { componentName: 'a' },
			2: { componentName: 'img' },
		};
		const expectState: StateType = {
			...legoState,
			undo: [{ componentConfigs }],
			componentConfigs: expectComponentConfigs,
			dropTarget: null,
			dragSource: null,
		};
		expect(state).toEqual(expectState);
	});
});

describe('copyComponent', () => {
	const action = { type: ACTION_TYPES.copyComponent };
	it('没有选中组件时', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});
	it('选中组价为根节点时', () => {
		const state: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [],
				parentKey: '',
				propsConfig: {},
			},
		};
		expect(reducer(state, action)).toEqual(state);
	});

	it('复制选中组件', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'a', childNodes: ['1'] },
			1: { componentName: 'a', childNodes: ['2'] },
			2: {
				componentName: 'span',
				childNodes: {
					children: ['3'],
				},
			},
			3: { componentName: 'p' },
		};
		const propsConfigSheet: PropsConfigSheetType = {
			1: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			propsConfigSheet,
			selectedInfo: {
				selectedKey: '1',
				parentKey: ROOT,
				domTreeKeys: [ROOT, '1'],
				propsConfig: {},
			},
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ componentConfigs, propsConfigSheet }],
			componentConfigs: {
				...componentConfigs,
				[ROOT]: { componentName: 'a', childNodes: ['1', '4'] },
				4: { componentName: 'a', childNodes: ['5'] },
				5: {
					componentName: 'span',
					childNodes: {
						children: ['6'],
					},
				},
				6: { componentName: 'p' },
			},
			propsConfigSheet: {
				1: {},
				4: {},
			},
		};
		expect(state).toEqual(expectState);
	});
});

describe('onLayoutSortChange', () => {
	const action = { type: ACTION_TYPES.onLayoutSortChange };
	it('容器内部排序', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'a', childNodes: ['1', '2', '3'] },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
		};
		const payload: LayoutSortPayload = {
			sortKeys: ['2', '1', '3'],
			parentKey: ROOT,
		};
		const state = reducer(prevState, { ...action, payload });
		expect(state.componentConfigs[ROOT].childNodes).toEqual(payload.sortKeys);
		expect(state.undo).toEqual([{ componentConfigs }]);
	});
	it('跨容器排序', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: {
				componentName: 'a',
				childNodes: ['1'],
			},
			1: { componentName: 'div', childNodes: { children: ['2'] } },
			2: { componentName: 'img' },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
		};
		const payload: LayoutSortPayload = {
			sortKeys: ['2', '1'],
			parentKey: ROOT,
			dragInfo: { parentKey: '1', parentPropName: 'children', key: '2' },
		};
		const state = reducer(prevState, { ...action, payload });
		const expectComponentConfigs = {
			[ROOT]: {
				componentName: 'a',
				childNodes: ['2', '1'],
			},
			1: { componentName: 'div' },
			2: { componentName: 'img' },
		};
		expect(state.componentConfigs).toEqual(expectComponentConfigs);
		expect(state.undo).toEqual([{ componentConfigs }]);
	});
});

describe('deleteComponent', () => {
	const action = { type: ACTION_TYPES.deleteComponent };
	it('没有选中组件时', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});

	it('删除根节点', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'img' },
		};
		const propsConfigSheet = { ROOT: {} };
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			parentKey: '',
			domTreeKeys: [ROOT],
			propsConfig: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			propsConfigSheet,
			selectedInfo,
		};

		const state = reducer(prevState, action);
		const expectState: StateType = {
			...legoState,
			componentConfigs: {},
			undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
			propsConfigSheet: {},
			selectedInfo: null,
		};
		expect(state).toEqual(expectState);
	});

	it('删除非根节点并且拥有属性节点', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'a', childNodes: ['1', '2'] },
			1: { componentName: 'div', childNodes: { children: ['3'] } },
			2: { componentName: 'img' },
			3: {
				componentName: 'span',
				childNodes: { children: ['4'], test: ['5'] },
			},
			4: { componentName: 'img' },
			5: { componentName: 'a', childNodes: ['6'] },
			6: { componentName: 'img' },
		};
		const propsConfigSheet: PropsConfigSheetType = {
			1: {},
			2: {},
			4: {},
			6: {},
		};
		const selectedInfo: SelectedInfoType = {
			selectedKey: '1',
			parentKey: ROOT,
			domTreeKeys: [ROOT, '1'],
			propsConfig: {},
		};

		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			propsConfigSheet,
			selectedInfo,
		};

		const state = reducer(prevState, action);
		const expectState: StateType = {
			...legoState,
			componentConfigs: {
				[ROOT]: { componentName: 'a', childNodes: ['2'] },
				2: { componentName: 'img' },
			},
			undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
			propsConfigSheet: { 2: {} },
			selectedInfo: null,
		};
		expect(state).toEqual(expectState);
	});

	it('删除非根节点并且没有属性节点', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'span', childNodes: { children: ['1', '2'] } },
			1: { componentName: 'div' },
			2: { componentName: 'img' },
		};
		const propsConfigSheet: PropsConfigSheetType = { 2: {} };
		const selectedInfo: SelectedInfoType = {
			selectedKey: '2',
			parentKey: ROOT,
			parentPropName: 'children',
			domTreeKeys: [ROOT, '2'],
			propsConfig: {},
		};

		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			propsConfigSheet,
			selectedInfo,
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...legoState,
			componentConfigs: {
				[ROOT]: { componentName: 'span', childNodes: { children: ['1'] } },
				1: { componentName: 'div' },
			},
			propsConfigSheet: {},
			undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
			selectedInfo: null,
		};
		expect(state).toEqual(expectState);
	});
});
describe('clearChildNodes', () => {
	const action = { type: ACTION_TYPES.clearChildNodes };
	it('没有选中组件时', () => {
		expect(reducer(legoState, action)).toEqual(legoState);
	});

	it('清除指定属性的所有子节点', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: {
				componentName: 'span',
				childNodes: { children: ['1'], test: ['2'] },
			},
			1: { componentName: 'div', childNodes: { children: ['3'] } },
			2: { componentName: 'img' },
			3: {
				componentName: 'span',
				childNodes: { children: ['4'], test: ['5'] },
			},
			4: { componentName: 'img' },
			5: { componentName: 'a', childNodes: ['6'] },
			6: { componentName: 'img' },
		};

		const propsConfigSheet: PropsConfigSheetType = {
			1: {},
			2: {},
			4: {},
			6: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			selectedInfo: {
				selectedKey: ROOT,
				propName: 'children',
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			propsConfigSheet,
		};

		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ componentConfigs, propsConfigSheet }],
			componentConfigs: {
				[ROOT]: { componentName: 'span', childNodes: { test: ['2'] } },
				2: { componentName: 'img' },
			},
			propsConfigSheet: { 2: {} },
		};
		expect(state).toEqual(expectState);
	});
	it('清除指定组件的所有子节点', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: {
				componentName: 'span',
				childNodes: { children: ['1'], test: ['2'] },
			},
			1: { componentName: 'div', childNodes: { children: ['3'] } },
			2: { componentName: 'img' },
			3: {
				componentName: 'span',
				childNodes: { children: ['4'], test: ['5'] },
			},
			4: { componentName: 'img' },
			5: { componentName: 'a', childNodes: ['6'] },
			6: { componentName: 'img' },
		};

		const propsConfigSheet: PropsConfigSheetType = {
			1: {},
			2: {},
			4: {},
			6: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			propsConfigSheet,
		};

		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ componentConfigs, propsConfigSheet }],
			componentConfigs: {
				[ROOT]: { componentName: 'span' },
			},
			propsConfigSheet: {},
		};
		expect(state).toEqual(expectState);
	});
	it('组件没有子节点触发清除', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'a' },
		};

		const propsConfigSheet: PropsConfigSheetType = {
			[ROOT]: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			propsConfigSheet,
		};

		const state = reducer(prevState, action);

		expect(state).toEqual(prevState);
	});
	it('组件多属性节点属性节点完全清空', () => {
		const componentConfigs: ComponentConfigsType = {
			[ROOT]: { componentName: 'span', childNodes: { children: ['1'] } },
			1: { componentName: 'p' },
		};

		const propsConfigSheet: PropsConfigSheetType = {
			[ROOT]: {},
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			componentConfigs,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				propName: 'children',
				parentKey: '',
				propsConfig: {},
			},
			propsConfigSheet,
		};

		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ componentConfigs, propsConfigSheet }],
			componentConfigs: {
				[ROOT]: { componentName: 'span' },
			},
		};
		expect(state).toEqual(expectState);
	});
});
