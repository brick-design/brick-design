import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { OverTargetPayload } from '../../actions';
import { legoState } from '../../store';
import { StateType } from '../../types';
import { ROOT } from '../../utils';

describe('hover 状态', () => {
  const payload: OverTargetPayload = { hoverKey: '1' };
  const action = { type: ACTION_TYPES.overTarget, payload };
  it('hover一个新组件', () => {
    const state = reducer(legoState, action);
    expect(state.hoverKey).toBe('1');
  });
  it('重复hover一个组件', () => {
    const prevState: StateType = { ...legoState, hoverKey: '1' };
    const nextState = reducer(prevState, action);
    expect(nextState).toBe(prevState);
  });
});
test('清除hover状态', () => {
  const state = reducer({ ...legoState, hoverKey: ROOT }, { type: ACTION_TYPES.clearHovered });
  expect(state.hoverKey).toBeNull();
});
