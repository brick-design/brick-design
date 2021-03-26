import ACTION_TYPES from '../actionTypes';
import { DragSourceType, DropTargetType } from '../../types';
import { createActions } from '../../utils';

export type DragSourcePayload = Partial<DragSourceType> & {
  componentName?: string;
  defaultProps?: any;
};
export const getDragSource = (payload: DragSourcePayload) =>
  createActions({
    type: ACTION_TYPES.getDragSource,
    payload,
  });

export type DragTemplatePayload = Required<
  Omit<DragSourceType, 'dragKey' | 'parentKey' | 'parentPropName'>
>;
export const getDragTemplate = (payload: DragTemplatePayload) =>
  createActions({
    type: ACTION_TYPES.getDragSource,
    payload,
  });

export type DragComponentPayload = Omit<
  DragSourceType,
  'vDOMCollection' | 'propsConfigCollection'
>;
export const getDragComponent = (payload: DragComponentPayload) =>
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

export const getDragSort=(payload:string[])=>createActions({type:ACTION_TYPES.dragSort,payload});
