import { addComponent, copyComponent } from '../../actions'
import ACTION_TYPES from '../../actions/actionTypes'

describe('actions test', () => {
	test('test actions', () => {
		expect(addComponent()).toEqual({ type: ACTION_TYPES.addComponent })
		expect(copyComponent()).toEqual({ type: ACTION_TYPES.copyComponent })
	})
})
