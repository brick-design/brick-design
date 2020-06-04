import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { legoState } from '../../store';

describe('undo',()=>{
  jest.resetModules()

  test('undo.length=0',()=>{
    const state=reducer(legoState,{type:ACTION_TYPES.undo})
    expect(state).toEqual(legoState)
  })

  test('undo.length!==0',()=>{
    const state=reducer({...legoState,undo:[{}],redo:[]},{type:ACTION_TYPES.undo})
    expect(state.redo.length).toBe(1)
  })
})

describe('redo',()=>{
  jest.resetModules()
  test('redo.length=0',()=>{
    const state=reducer(legoState,{type:ACTION_TYPES.redo})
    expect(state).toEqual(legoState)
  })

  test('redo.length!==0',()=>{
    const state=reducer({...legoState,redo:[{}],undo:[]},{type:ACTION_TYPES.redo})
    expect(state.undo.length).toBe(1)
  })
})

