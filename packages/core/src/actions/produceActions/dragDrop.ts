import ACTION_TYPES from '../actionTypes';
import { DragSourceType, DropTargetType } from '../../types';
import { LEGO_BRIDGE } from '../../store';
const {dispatch}=LEGO_BRIDGE.store!

  export type DragSourcePayload=Partial<DragSourceType>&{componentName?:string, defaultProps?:any }
export const getDragSource=(payload:DragSourcePayload)=>dispatch({type:ACTION_TYPES.getDragSource,payload})
export type DropTargetPayload=Partial<DropTargetType>
export const getDropTarget=(payload:DropTargetPayload)=>dispatch({type:ACTION_TYPES.getDropTarget,payload})
