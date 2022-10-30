import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';
import { ParentNodeInfo } from '../../types';

export const addComponent = () =>
  createActions({ type: ACTION_TYPES.addComponent });
export interface   OperatePayload extends ParentNodeInfo{
  key?:string

}
export const copyComponent = (payload:OperatePayload) =>
  createActions({ type: ACTION_TYPES.copyComponent,payload });

export type DragInfoType = ParentNodeInfo & { key: string };
export type LayoutSortPayload = ParentNodeInfo & {
  sortKeys: string[];
  dragInfo?: DragInfoType;
};

export const onLayoutSortChange = (payload: LayoutSortPayload) =>
  createActions({
    type: ACTION_TYPES.onLayoutSortChange,
    payload,
  });


export const deleteComponent = (payload:OperatePayload) =>
  createActions({ type: ACTION_TYPES.deleteComponent,payload });

export const clearChildNodes = (payload:OperatePayload) =>
  createActions({ type: ACTION_TYPES.clearChildNodes,payload });
