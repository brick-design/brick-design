import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type CreateLayersPayload = {
  layerName: string;
};

export type RenameLayersPayload = {
  prevLayerName: string;
  newLayerName: string;
};

export const createLayers = (payload: CreateLayersPayload) =>
  createActions({ type: ACTION_TYPES.createLayers, payload });

export const deleteLayers = (payload: CreateLayersPayload) =>
  createActions({
    type: ACTION_TYPES.deleteLayers,
    payload,
  });

export const copyLayers = (payload: CreateLayersPayload) =>
  createActions({
    type: ACTION_TYPES.copyLayers,
    payload,
  });

export const renameLayers = (payload: RenameLayersPayload) =>
  createActions({ type: ACTION_TYPES.renameLayers, payload });

export const changeLayer = (payload: CreateLayersPayload) =>
  createActions({ type: ACTION_TYPES.changeLayer, payload });
