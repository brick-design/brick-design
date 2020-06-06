import { reducer } from '../../reducers'
import ACTION_TYPES from '../../actions/actionTypes'
import { LEGO_BRIDGE, legoState } from '../../store'
import { ComponentConfigsType, StateType } from '../../types'
import config from '../configs'
import { flattenDeepArray } from '../../utils'
jest.resetModules()
beforeAll(() => {
	LEGO_BRIDGE.config = config
	LEGO_BRIDGE.containers = flattenDeepArray(config.CONTAINER_CATEGORY)
})
afterAll(() => {
	LEGO_BRIDGE.config = undefined
	LEGO_BRIDGE.containers = null
})
describe('addComponent', () => {
	test('dragSource===null', () => {
		const state = reducer(legoState, { type: ACTION_TYPES.addComponent })
		expect(state).toBe(legoState)
	})
	test('没有dropTarget或者selectedInfo===null', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				root: {
					componentName: 'img',
					props: {},
				},
			},
			dragSource: { dragKey: '1', parentKey: '' },
		}
		const state = reducer(prevState, { type: ACTION_TYPES.addComponent })
		expect(state.dragSource).toBeNull()
	})
	test('parentKey===selectedKey', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root'],
				parentKey: '',
			},
			dragSource: { parentKey: 'root', dragKey: '1' },
		}
		const state = reducer(prevState, { type: ACTION_TYPES.addComponent })
		expect(state).toBe(prevState)
	})
	test('domTreeKeys.includes(dragKey!)', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root', '1'],
				parentKey: '',
			},
			dragSource: { parentKey: '2', dragKey: '1' },
		}
		const state = reducer(prevState, { type: ACTION_TYPES.addComponent })
		expect(state).toBe(prevState)
	})
	test('componentConfigs.root is undefined', () => {
		const vDOMCollection: ComponentConfigsType = {
			root: { componentName: 'a', props: {} },
		}
		const prevState: StateType = {
			...legoState,
			dragSource: {
				dragKey: 'root',
				vDOMCollection,
				parentKey: '',
			},
		}

		const state = reducer(prevState, { type: ACTION_TYPES.addComponent })
		expect(state.componentConfigs).toBe(vDOMCollection)
	})
	test('父组件约束限制', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				root: {
					componentName: 'span',
					props: {},
				},
				'1': {
					componentName: 'div',
					props: {},
				},
			},
			dragSource: { dragKey: '1', parentKey: '' },
			dropTarget: { selectedKey: 'root', domTreeKeys: [] },
		}
		expect(() =>
			reducer(prevState, { type: ACTION_TYPES.addComponent }),
		).toThrow('div:只允许放入div.children组件或者属性中')
	})
	test('子组件约束限制', () => {
		const prevState: StateType = {
			...legoState,
			componentConfigs: {
				root: {
					componentName: 'span',
					props: {},
				},
				'1': {
					componentName: 'span',
					props: {},
				},
			},
			dragSource: { dragKey: '1', parentKey: '' },
			dropTarget: { selectedKey: 'root', propName: 'test', domTreeKeys: [] },
		}
		expect(() =>
			reducer(prevState, { type: ACTION_TYPES.addComponent }),
		).toThrow('test:只允许拖拽a组件')
	})
})
describe('清除选中', () => {
	test('当没有选中组件时', () => {
		const state = reducer(legoState, { type: ACTION_TYPES.clearSelectedStatus })
		expect(state).toEqual(legoState)
	})

	test('当选中组件的属性节点为必填非空组件时', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root'],
				propName: 'children',
				parentKey: '',
			},
			componentConfigs: {
				root: {
					componentName: 'span',
					props: {},
					childNodes: {
						children: [],
						test: [],
					},
				},
			},
		}
		const state = reducer(prevState, { type: ACTION_TYPES.clearSelectedStatus })
		expect(state).toEqual(prevState)
	})

	test('正常清除', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root'],
				parentKey: '',
			},
			componentConfigs: {
				root: {
					componentName: 'img',
					props: {},
				},
			},
		}
		const state = reducer(prevState, { type: ACTION_TYPES.clearSelectedStatus })
		expect(state.selectedInfo).toBeNull()
	})
})
