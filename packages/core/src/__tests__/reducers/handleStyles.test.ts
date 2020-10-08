import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { legoState } from '../../store';
import { PageConfigType, SelectedInfoType, StateType } from '../../types';
import { ROOT } from '../../utils';

describe('changeStyle', () => {
	const action = { type: ACTION_TYPES.changeStyles };
	test('selectedInfo=null', () => {
		const state = reducer(legoState, {
			...action,
			payload: { style: {} },
		});
		expect(state).toBe(legoState);
	});
	test('props===undefined', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			pageConfig: {
				[ROOT]: {
					componentName: 'img',
				},
			},
		};
		const state = reducer(prevState, {
			...action,
			payload: { style: {} },
		});
		expect(state.pageConfig[ROOT].props).toEqual({ style: {} });
	});
	test('props!==undefined', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: ROOT,
				domTreeKeys: [ROOT],
				parentKey: '',
				propsConfig: {},
			},
			pageConfig: {
				[ROOT]: {
					componentName: 'img',
					props: {},
				},
			},
		};
		const state = reducer(prevState, {
			...action,
			payload: { style: {} },
		});
		expect(state.pageConfig[ROOT].props).toEqual({ style: {} });
	});
});
describe('resetStyle', () => {
	const action = { type: ACTION_TYPES.resetStyles };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toBe(legoState);
	});
	it('重置样式 props===undefined', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			domTreeKeys: [],
			parentKey: '',
		};
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'a', props: { style: { a: 1 } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			selectedInfo,
			pageConfig,
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: {
					componentName: 'a',
				},
			},
		};
		expect(state).toEqual(expectState);
	});
	it('重置样式 prop!==undefined', () => {
		const selectedInfo: SelectedInfoType = {
			selectedKey: ROOT,
			propsConfig: {},
			domTreeKeys: [],
			props: { style: {} },
			parentKey: '',
		};
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'a', props: { style: { a: 1 } } },
		};
		const prevState: StateType = {
			...legoState,
			undo: [],
			selectedInfo,
			pageConfig,
		};
		const state = reducer(prevState, action);
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: {
					componentName: 'a',
					props: { style: {} },
				},
			},
		};
		expect(state).toEqual(expectState);
	});
});

describe('resizeChange', () => {
	const action = { type: ACTION_TYPES.resizeChange };
	it('selectedInfo===null', () => {
		expect(reducer(legoState, action)).toBe(legoState);
	});
	it('更改组件宽高有宽和高', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'div' },
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
			},
		};
		const state = reducer(prevState, {
			...action,
			payload: { width: 12, height: 13 },
		});
		const expectState: StateType = {
			...prevState,
			undo: [{ pageConfig }],
			pageConfig: {
				[ROOT]: {
					componentName: 'div',
					props: { style: { width: 12, height: 13 } },
				},
			},
		};
		expect(state).toEqual(expectState);
	});
	it('更改组件宽高没有宽和高', () => {
		const pageConfig: PageConfigType = {
			[ROOT]: { componentName: 'div' },
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
			},
		};
		const state = reducer(prevState, { ...action, payload: {} });

		expect(state).toEqual(state);
	});
});
