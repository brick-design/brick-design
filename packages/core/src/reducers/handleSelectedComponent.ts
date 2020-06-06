import get from 'lodash/get';
import { merge } from 'lodash';
import { StateType } from '../types';
import { SelectComponentPayload } from '../actions';
import { LEGO_BRIDGE } from '../store';
import { handleRequiredHasChild } from '../utils';

/**
 * 选中组件
 * @param state
 * @param payload
 * @returns {{ undo: *, propsSetting: {propsConfig, mergePropsConfig, addPropsConfig: *, props: *}, redo: *, selectedInfo: {selectedKey: *, location: *, domTreeKeys: *[], fatherLocation: *, isContainer: boolean, style: *, componentName: *, nodePropsConfig}}}
 */

export function selectComponent(state:StateType, payload:SelectComponentPayload ) {
    const { undo, redo, selectedInfo, propsSetting,componentConfigs } = state;
    const { propName, domTreeKeys,key,parentKey,parentPropName } = payload;

    if(selectedInfo&&selectedInfo.propName){
        if (selectedInfo.selectedKey===key&&selectedInfo.propName===propName||
          handleRequiredHasChild(selectedInfo, componentConfigs, payload)) {
            return state;
        }else if(selectedInfo.selectedKey===key&&selectedInfo.propName!==propName){
            domTreeKeys.push(`${key}${propName}`)
            return {
                ...state,
                selectedInfo: {
                    ...selectedInfo,
                    propName,
                    domTreeKeys
                }
            }
        }
    }

    if (propName) {
        domTreeKeys.push(`${key}${propName}`);
    }
    const { props, addPropsConfig = {},componentName} = componentConfigs[key];
    const { propsConfig } = get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName);

    const mergePropsConfig = merge({}, propsConfig, addPropsConfig);
    undo.push({ selectedInfo, propsSetting });

    redo.length = 0;
    return {
        ...state,
        dropTarget: null,
        selectedInfo: {
            selectedKey:key,
            propName,
            domTreeKeys,
            parentKey,
            parentPropName,
            style:props.style
        },
        propsSetting: { propsConfig, mergePropsConfig, addPropsConfig, props },
        undo,
        redo,
        hoverKey: null,

    };
}

/**
 * 清除选中状态
 * @param state
 * @returns {{undo: *, propsSetting: {}, redo: *, selectedInfo: {}}}
 */
export function clearSelectedStatus(state:StateType) {
    const { selectedInfo,dropTarget, propsSetting,componentConfigs, undo, redo } = state;
    if (!selectedInfo||selectedInfo.propName&&handleRequiredHasChild(selectedInfo, componentConfigs)) {
        return state;
    }
    undo.push({ selectedInfo, propsSetting,dropTarget });
    redo.length = 0;
    return {
        ...state,
        dropTarget:null,
        selectedInfo: null,
        propsSetting: null,
        undo,
        redo,
    };
}
