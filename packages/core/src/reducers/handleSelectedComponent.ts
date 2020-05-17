import get from 'lodash/get';
import { merge } from 'lodash';
import { StateType } from '../types';
import { SelectComponentType } from '../actions';
import { LEGO_BRIDGE } from '../store';
import { handleRequiredHasChild } from '../utils';

/**
 * 选中组件
 * @param state
 * @param payload
 * @returns {{ undo: *, propsSetting: {propsConfig, mergePropsConfig, addPropsConfig: *, props: *}, redo: *, selectedInfo: {selectedKey: *, location: *, domTreeKeys: *[], fatherLocation: *, isContainer: boolean, style: *, componentName: *, nodePropsConfig}}}
 */

export function selectComponent(state:StateType, payload:SelectComponentType ) {
    const { undo, redo, selectedInfo, propsSetting,componentConfigs } = state;
    if (selectedInfo&&handleRequiredHasChild(selectedInfo, componentConfigs, payload)) {
        return state;
    }
    const { propName, domTreeKeys,key,parentKey,parentPropName } = payload;

    if(selectedInfo&&selectedInfo.selectedKey===key&&!propName){
        if(selectedInfo.propName){
            domTreeKeys.push(`${key}${selectedInfo.propName}`)
        }
        return {
            ...state,
            selectedInfo: {
                ...selectedInfo,
                domTreeKeys,
                parentKey,
                parentPropName
            }
        }
    }
    if (propName) {
        domTreeKeys.push(`${key}${propName}`);
    }
    const { props, addPropsConfig = {},componentName} = componentConfigs[key];
    //todo
    // const { isContainer, isOnlyNode, childNodesRule, componentName } = handleComponentInfo(payload);
    let { propsConfig } = get(LEGO_BRIDGE.config.AllComponentConfigs, componentName);

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
        },
        propsSetting: { propsConfig, mergePropsConfig, addPropsConfig, props },
        undo,
        redo,
        styleSetting: props.style,
        hoverKey: null,

    };
}

/**
 * 清除选中状态
 * @param state
 * @returns {{undo: *, propsSetting: {}, redo: *, selectedInfo: {}}}
 */
export function clearSelectedStatus(state:StateType) {
    const { selectedInfo,dropTarget, propsSetting,componentConfigs, undo, redo, styleSetting } = state;
    if (selectedInfo&&handleRequiredHasChild(selectedInfo, componentConfigs)) {
        return state;
    }
    undo.push({ selectedInfo, propsSetting, styleSetting,dropTarget });
    redo.length = 0;
    return {
        ...state,
        dropTarget:null,
        selectedInfo: null,
        propsSetting: null,
        styleSetting: null,
        undo,
        redo,
    };
}
