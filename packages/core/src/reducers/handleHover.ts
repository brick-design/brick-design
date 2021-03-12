import { StateType } from '../types';
import { OverTargetPayload } from '../actions';

/**
 * 清除hover状态
 * @param state
 * @returns {{hoverKey: null}}
 */
export function clearHovered(state: StateType): StateType {
  return {
    ...state,
    hoverKey: null,
  };
}

/**
 * 目标组件
 * @param state
 * @param payload
 */
export function overTarget(
  state: StateType,
  payload: OverTargetPayload,
): StateType {
  const { hoverKey } = payload;
  const { hoverKey: prevHoverKey } = state;
  if (hoverKey === prevHoverKey) return state;
  return {
    ...state,
    hoverKey,
  };
}
