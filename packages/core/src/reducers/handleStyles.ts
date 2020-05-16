import { update } from "lodash";
import {StateType} from "../types";
import produce from "immer";

/**
 * 样式改变时调用
 * @param state
 * @param payload
 * @returns {{propsSetting: *, componentConfigs: *}|*}
 */
export function changeStyles(state:StateType, payload:any) {
    const { style } = payload;
    const { undo, redo, selectedInfo, componentConfigs, styleSetting } = state;
    if (!selectedInfo) return state;
    undo.push({ componentConfigs, styleSetting });
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
