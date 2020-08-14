import ACTION_TYPES from '../actionTypes';
import { DragSourceType, DropTargetType } from '../../types';
import { createActions } from '../../store';

export type DragSourcePayload = Partial<DragSourceType> & {
	componentName?: string
	defaultProps?: any
}
export const getDragSource = (payload: DragSourcePayload) =>
	createActions({
		type: ACTION_TYPES.getDragSource,
		payload,
	});
export const getDropTarget = (payload: DropTargetType) =>
	createActions({
		type: ACTION_TYPES.getDropTarget,
		payload,
	});

export const clearDropTarget = () =>
	createActions({
		type: ACTION_TYPES.clearDropTarget,
	});

export const clearDragSource = () =>
	createActions({
		type: ACTION_TYPES.clearDragSource,
	});
