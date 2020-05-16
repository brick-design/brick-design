import {createStore, Store,Dispatch} from 'redux'
import {reducer} from './reducers'
import {StateType} from "./interfaces";
import defaultData from './data';
import {flattenDeepArray} from "@/utils";
import config from "@/configs";
type LegoBridge={
    dispatch:Dispatch,
    store:Store|null,
    containers:string[]
}
export const LEGO_BRIDGE:LegoBridge={
    dispatch:(action)=>action,
    store:null,
    containers : flattenDeepArray(config.CONTAINER_CATEGORY)

}


const initState:StateType={
    componentConfigs: {}, // 所有组件信息
    selectedInfo: null, // 选中组件的信息
    propsSetting: null,  // 属性设置暂存属性数据
    styleSetting:null,
    undo: [],
    redo: [],
    //todo
    templateInfos: [], // 复合组件
    //todo
    hoverKey: null,
    dragSource: null,
    dropTarget: null,
    platformInfo: { isMobile: false, size: ['100%', '100%'] },
}

export default function () {
    if(LEGO_BRIDGE.store) return LEGO_BRIDGE.store
    const  store= createStore(reducer,initState)
    LEGO_BRIDGE.dispatch=store.dispatch
    LEGO_BRIDGE.store=store
    return store
}
