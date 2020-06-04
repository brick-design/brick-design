import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { legoState } from '../../store';
import { PlatformInfoType } from '../../types';

test('更改平台信息',()=>{
  const payload:PlatformInfoType={size:[1,3],isMobile:true}
  const state=reducer(legoState,{type:ACTION_TYPES.changePlatform,payload})
  expect(state.platformInfo).toBe(payload)
})
