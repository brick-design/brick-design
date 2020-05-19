import { update } from 'lodash';
import { StateType } from '../types';
import produce from 'immer';
import { stylePayload } from '../actions';

/**
 * 样式改变时调用
 * @param state
 * @param payload
 * @returns {{propsSetting: *, componentConfigs: *}|*}
 */
export function changeStyles(state:StateType, payload:stylePayload) {
    const { style } = payload;
    const { undo, redo, selectedInfo, componentConfigs } = state;
    if (!selectedInfo) return state;
    undo.push({ componentConfigs });
    redo.length = 0;

    return {
        ...state,
        componentConfigs:produce(componentConfigs!,oldConfigs=>{
            update(oldConfigs,selectedInfo.selectedKey, componentConfig => {
                componentConfig.props.style = style;
                return componentConfig;
            });
        }),
        undo,
        redo,
    };

}
