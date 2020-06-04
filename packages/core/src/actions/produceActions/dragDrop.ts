import ACTION_TYPES from '../actionTypes';
import { DragSourceType, DropTargetType } from '../../types';
import { LEGO_BRIDGE } from '../../store';

export type DragSourcePayload=Partial<DragSourceType>&{componentName?:string, defaultProps?:any }
export const getDragSource=(payload:DragSourcePayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.getDragSource,payload})
export type DropTargetPayload=Partial<DropTargetType>
export const getDropTarget=(payload:DropTargetPayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.getDropTarget,payload})
