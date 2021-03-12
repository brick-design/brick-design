import { PlatformInfoType, StateType } from '../types';

/**
 * 更改平台
 * @param state
 * @param payload
 */
export function changePlatform(
  state: StateType,
  payload: PlatformInfoType,
): StateType {
  return {
    ...state,
    platformInfo: payload,
  };
}
