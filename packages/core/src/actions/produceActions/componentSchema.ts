import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';
import { ParentNodeInfo } from '../../types';

export const addComponent = () =>
  createActions({ type: ACTION_TYPES.addComponent });
export const copyComponent = () =>
  createActions({ type: ACTION_TYPES.copyComponent });

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
export const deleteComponent = () =>
  createActions({ type: ACTION_TYPES.deleteComponent });
export const clearChildNodes = () =>
  createActions({ type: ACTION_TYPES.clearChildNodes });
