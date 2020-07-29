import { reducer } from '../../reducers'
import ACTION_TYPES from '../../actions/actionTypes'
import { legoState } from '../../store'
import { StateType } from '@brickd/core'

describe('undo', () => {
	const action = { type: ACTION_TYPES.undo }
	test('undo.length=0', () => {
		const state = reducer(legoState, action)
		expect(state).toEqual(legoState)
	})

	test('undo.length!==0', () => {
		const prevState: StateType = {
			...legoState,
			undo: [{ hoverKey: '1' }],
			redo: [],
		}
		const state = reducer(prevState, action)
		const expectState: StateType = {
			...legoState,
			undo: [],
			redo: [{ hoverKey: null }],
			hoverKey: '1',
		}
		expect(state).toEqual(expectState)
	})
})

describe('redo', () => {
	const action = { type: ACTION_TYPES.redo }
	test('redo.length=0', () => {
		const state = reducer(legoState, action)
		expect(state).toEqual(legoState)
	})

	test('redo.length!==0', () => {
		const prevState: StateType = {
			...legoState,
			redo: [{ hoverKey: '1' }],
			undo: [],
		}
		const state = reducer(prevState, action)
		const expectState: StateType = {
			...legoState,
			redo: [],
			undo: [{ hoverKey: null }],
			hoverKey: '1',
		}
		expect(state).toEqual(expectState)
	})
})
