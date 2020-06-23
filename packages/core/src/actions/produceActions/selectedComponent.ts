import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../store';
import { SelectedInfoBaseType } from '../../types';

export type SelectComponentPayload = SelectedInfoBaseType & { propName?: string }
export const selectComponent = (payload: SelectComponentPayload) => createActions({
  type: ACTION_TYPES.selectComponent,
  payload,
});

export const clearSelectedStatus = () => createActions({ type: ACTION_TYPES.clearSelectedStatus });
