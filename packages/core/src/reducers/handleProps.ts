import { merge, update,  isEmpty } from "lodash";
import {getFieldInPropsLocation} from "../utils";
import {StateType} from "../types";
import produce from "immer";
/**
 * 添加属性配置
 * @param state
 * @param payload
 * @returns {{propsSetting: *}}
 */
export function addPropsConfig(state:StateType, payload:any) {
    const { newPropField, fatherFieldLocation, childPropsConfig, propType } = payload;
    const { propsSetting, undo, redo } = state;
    const { addPropsConfig, propsConfig } = propsSetting!;
    let isAdd = true;
    //todo
  let newAddPropsConfig=produce(addPropsConfig,oldAddPropsConfig=>{
      update(oldAddPropsConfig, fatherFieldLocation, (propsContent: any) => {
        // 对象数组 添加一个对象时的逻辑
        if (childPropsConfig) return childPropsConfig;
        if (!propsContent) propsContent = {};
        if (propsContent[newPropField]) {
            isAdd = false;
            console.warn(`${newPropField}属性已存在`);
        } else {
            propsContent[newPropField] = {
                label: newPropField,
                type: propType,
                isAdd: true,
            };
        }
        return propsContent;
    })});
    if (!isAdd) return state;
    const mergePropsConfig =merge({}, propsConfig, newAddPropsConfig);
    undo.push({ propsSetting});
    redo.length = 0;
    return {
        ...state,
        propsSetting: {
            ...propsSetting,
            addPropsConfig:newAddPropsConfig,
            mergePropsConfig,
        },
        undo,
        redo,
    };
}

/**
 * 删除属性配置
 * @param state
 * @param payload
 * @returns {{propsSetting: *}}
 */
export function deletePropsConfig(state:StateType, payload:any) {
    const { propsSetting, undo, redo } = state;
    const { fatherFieldLocation, field } = payload;
    const { addPropsConfig, propsConfig, props } = propsSetting!;
    const fieldInPropsLocation = getFieldInPropsLocation(fatherFieldLocation);
    let newAddPropsConfig=produce(addPropsConfig,oldAddPropsConfig=>{
        update(oldAddPropsConfig, fatherFieldLocation, prevPropsConfig => {
            delete prevPropsConfig[field];
            return prevPropsConfig;
        });
    })


    let newProps=produce(props,(oldProps:any)=>{
        update(oldProps, fieldInPropsLocation, prevProps => {
            if (typeof prevProps === 'object') {
                delete prevProps[field];
            }
            return prevProps;
        });
    })

    const mergePropsConfig = merge({}, propsConfig, newAddPropsConfig);
    undo.push({ propsSetting });
    redo.length = 0;
    return {
        ...state,
        propsSetting: {
            ...propsSetting,
            props:newProps,
            addPropsConfig:newAddPropsConfig,
            mergePropsConfig,
        },
        undo,
        redo,
    };
}

/**
 * 提交属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, componentConfigs: *}}
 */
export function submitProps(state:StateType, payload:any) {
    const { props } = payload;
    const { propsSetting, componentConfigs, selectedInfo, undo, redo } = state;
    const {selectedKey}=selectedInfo!

    undo.push({ componentConfigs, propsSetting });
    redo.length = 0;
    console.log('属性配置提交成功！！');
    return {
        ...state,
        propsSetting: {
            ...propsSetting,
            props,
        },
        componentConfigs:produce(componentConfigs!,oldConfigs=>{
            update(oldConfigs,selectedKey,  (componentConfig) => {
                const { addPropsConfig } = propsSetting!;
                const { props: { style } } = componentConfig;
                return ({
                    ...componentConfig,
                    props: { ...props, style },
                    ...(isEmpty(addPropsConfig) ? {} : { addPropsConfig }),
                });
            });
        }),
        undo,
        redo,
    };
}


