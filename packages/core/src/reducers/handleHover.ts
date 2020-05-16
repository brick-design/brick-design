import { StateType } from '../types';

/**
 * 清除hover状态
 * @param state
 * @returns {{hoverKey: null}}
 */
export function clearHovered(state:StateType) {
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
export function overTarget(state:StateType, payload:any) {
    const { hoverKey } = payload;
    const {hoverKey:prevHoverKey}=state
    if(hoverKey===prevHoverKey) return  state
    return {
        ...state,
        hoverKey,
    };
}
