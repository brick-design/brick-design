import { createStore, Dispatch, Store } from 'redux';
import { reducer } from './reducers';
import { BrickAction, ConfigType, StateType } from './types';

type LegoBridge={
    dispatch:Dispatch,
    containers:string[]|null,
    config?:ConfigType,
    store:Store<StateType,BrickAction>|null
}
export const LEGO_BRIDGE:LegoBridge={
    dispatch:(action)=>action,
    containers: null,
    store:null

}

export const STATES={
    componentConfigs:'componentConfigs',
    selectedInfo:'selectedInfo',
    propsSetting:'propsSetting',
    undo:'undo',
    redo:'redo',
    hoverKey:'hoverKey',
    dragSource:'dragSource',
    dropTarget:'dropTarget',
    platformInfo:'platformInfo'

}
export const legoState:StateType={
    componentConfigs: {}, // 所有组件信息
    selectedInfo: null, // 选中组件的信息
    propsSetting: null,  // 属性设置暂存属性数据
    undo: [],
    redo: [],
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

