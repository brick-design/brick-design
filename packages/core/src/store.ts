import {createStore, Store,Dispatch} from 'redux'
import {reducer} from './reducers'
import {ConfigType, StateType} from "./types";
import {flattenDeepArray} from "./utils";
type LegoBridge={
    dispatch:Dispatch,
    containers:string[]|null,
    config:ConfigType|null,
    store:Store|null
}
export const LEGO_BRIDGE:LegoBridge={
    dispatch:(action)=>action,
    config:null,
    containers : null,
    store:null

}


const legoState:StateType={
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

export function createLegStore (initState:Partial<StateType>={}) {
    if(LEGO_BRIDGE.store) return LEGO_BRIDGE.store
    const  store= createStore(reducer,{...legoState,...initState})
    LEGO_BRIDGE.store=store
    LEGO_BRIDGE.dispatch=store.dispatch
    return store
}

