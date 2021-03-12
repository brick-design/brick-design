import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { OverTargetPayload } from '../../actions';
import { legoState } from '../../reducers/handlePageBrickdState';
import { StateType } from '../../types';
import { ROOT, setPageName } from '../../utils';

beforeAll(() => {
  setPageName('initPage');
});

afterAll(() => {
  setPageName(null);
});
describe('hover 状态', () => {
  const payload: OverTargetPayload = { hoverKey: '1' };
  const action = { type: ACTION_TYPES.overTarget, payload };
  it('hover一个新组件', () => {
    const state = reducer({ initPage: legoState }, action);
    expect((state.initPage as StateType).hoverKey).toBe('1');
  });
  it('重复hover一个组件', () => {
    const prevState: StateType = { ...legoState, hoverKey: '1' };
    const brickdState = { initPage: prevState };
    const nextState = reducer(brickdState, action);
    expect(nextState).toBe(brickdState);
  });
});
test('清除hover状态', () => {
  const state = reducer(
    { initPage: { ...legoState, hoverKey: ROOT } },
    { type: ACTION_TYPES.clearHovered },
  );
  expect((state.initPage as StateType).hoverKey).toBeNull();
});
