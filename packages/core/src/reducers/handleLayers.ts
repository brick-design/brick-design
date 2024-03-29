import { keys, each } from 'lodash';
import { legoState } from './handlePageBrickdState';
import { BrickDesignStateType } from '../types';
import { CreateLayersPayload, RenameLayersPayload } from '../actions';

export function createLayers(
  state: BrickDesignStateType,
  payload: CreateLayersPayload,
): BrickDesignStateType {
  const { layerName } = payload;
  return {
    ...state,
    layerName,
    [layerName]: legoState,
  };
}

export function deleteLayers(
  state: BrickDesignStateType,
  payload: CreateLayersPayload,
): BrickDesignStateType {
  const { layerName } = payload;
  const { layerName: selectedLayerName } = state;
  delete state[layerName];
  const layers= keys(state);
  layers.shift();

  const newLayerName= selectedLayerName === layerName ?layers[0]  : selectedLayerName;
  return {
    ...state,
    layerName:newLayerName,

  };
}

export function renameLayers(
  state: BrickDesignStateType,
  payload: RenameLayersPayload,
): BrickDesignStateType {
  const { newLayerName, prevLayerName } = payload;
  const prevState = state[prevLayerName];
  delete state[prevLayerName];
  return {
    ...state,
    layerName: newLayerName,
    [newLayerName]: prevState,
  };
}

export function changeLayer(
  state: BrickDesignStateType,
  payload: CreateLayersPayload,
): BrickDesignStateType {
  const { layerName } = payload;
  if (state.layerName === layerName) return state;
  return {
    ...state,
    layerName,
  };
}

export function copyLayers(
  state: BrickDesignStateType,
  payload: CreateLayersPayload,
): BrickDesignStateType {
  const { layerName } = payload;
  const brickKeys = keys(state);
  let copyIndex = 0;
  each(brickKeys, (key) => {
    if (key.includes(layerName)) {
      copyIndex++;
    }
  });
  const newLayerName = layerName + copyIndex;

  return {
    ...state,
    [newLayerName]: state[layerName],
  };
}
