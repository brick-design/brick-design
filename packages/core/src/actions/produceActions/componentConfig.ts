import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { ParentNodeInfo } from '../../types';
const {dispatch}=LEGO_BRIDGE.store!

export const addComponent=()=> dispatch({type:ACTION_TYPES.addComponent})
export const copyComponent=()=>dispatch({type:ACTION_TYPES.copyComponent})

export type DragInfoType=ParentNodeInfo&{ key:string}
export type LayoutSortPayload=ParentNodeInfo&{ sortKeys:string[], dragInfo?:DragInfoType }

export const onLayoutSortChange= (payload: LayoutSortPayload)=>dispatch({type:ACTION_TYPES.onLayoutSortChange,payload})
export const deleteComponent=()=>dispatch({type:ACTION_TYPES.deleteComponent})
export const clearChildNodes=()=>dispatch({type:ACTION_TYPES.clearChildNodes})
