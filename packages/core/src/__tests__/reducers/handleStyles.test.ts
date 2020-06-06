import { reducer } from '../../reducers'
import ACTION_TYPES from '../../actions/actionTypes'
import { legoState } from '../../store'
import { StateType } from '../../types'

describe('changeStyle', () => {
	test('selectedInfo=null', () => {
		const state = reducer(legoState, {
			type: ACTION_TYPES.changeStyles,
			payload: { style: {} },
		})
		expect(state).toBe(legoState)
	})
	test('selectedInfo!=null', () => {
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
		const state = reducer(prevState, {
			type: ACTION_TYPES.changeStyles,
			payload: { style: {} },
		})
		expect(state.componentConfigs.root.props).toEqual({ style: {} })
	})
})
