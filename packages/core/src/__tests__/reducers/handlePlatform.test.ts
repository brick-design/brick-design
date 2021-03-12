import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { legoState } from '../../reducers/handlePageBrickdState';
import { PlatformInfoType, StateType } from '../../types';
import { setPageName } from '../../utils';

beforeAll(() => {
  setPageName('initPage');
});

afterAll(() => {
  setPageName(null);
});
test('更改平台信息', () => {
  const payload: PlatformInfoType = { size: [1, 3], isMobile: true };
  const state = reducer(
    { initPage: legoState },
    {
      type: ACTION_TYPES.changePlatform,
      payload,
    },
  );
  expect((state.initPage as StateType).platformInfo).toBe(payload);
});
