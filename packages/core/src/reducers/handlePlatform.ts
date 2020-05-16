import { StateType } from '../types';

/**
 * 更改平台
 * @param state
 */
export function changePlatform(state:StateType, payload:any) {
    return {
        ...state,
        platformInfo: payload,
        redo: [],
        undo: [],
    };
}
