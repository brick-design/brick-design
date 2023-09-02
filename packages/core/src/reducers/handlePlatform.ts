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
  const { platformInfo } = state;
  return {
    ...state,
    platformInfo: { ...platformInfo, ...payload },
  };
}
