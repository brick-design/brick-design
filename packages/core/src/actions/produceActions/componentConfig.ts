import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { ParentNodeInfo } from '../../types';

export const addComponent = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.addComponent });
export const copyComponent = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.copyComponent });

export type DragInfoType = ParentNodeInfo & { key: string }
export type LayoutSortPayload = ParentNodeInfo & { sortKeys: string[], dragInfo?: DragInfoType }

export const onLayoutSortChange = (payload: LayoutSortPayload) => LEGO_BRIDGE.store!.dispatch({
  type: ACTION_TYPES.onLayoutSortChange,
  payload,
});
export const deleteComponent = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.deleteComponent });
export const clearChildNodes = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.clearChildNodes });
