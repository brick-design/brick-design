import { Reducer } from 'redux';
import { get } from 'lodash';
import {
  addComponent,
  clearChildNodes,
  copyComponent,
  deleteComponent,
  onLayoutSortChange,
} from './handleComponentSchema';

import { clearHovered, overTarget } from './handleHover';
import { changePlatform } from './handlePlatform';
import { changeProps, resetProps } from './handleProps';
import {
  clearSelectedStatus,
  selectComponent,
} from './handleSelectedComponent';
import { changeStyles, resetStyles, resizeChange } from './handleStyles';
import { redo, undo } from './handleRedoUndo';
import { setApi, setComponentState } from './handleComponetStateApi';
import { setStateDomain, restStateDomain } from './handleStateDomain';
import { initPageBrickdState, legoState } from './handlePageBrickdState';
import {
  createLayers,
  renameLayers,
  deleteLayers,
  changeLayer,
  copyLayers,
} from './handleLayers';
import ACTION_TYPES from '../actions/actionTypes';
import { BrickAction, BrickDesignStateType, StateType } from '../types';

export type ReducerType = Reducer<BrickDesignStateType, BrickAction>;
export const reducer: ReducerType = (prevState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.createLayers:
      return createLayers(prevState, payload);
    case ACTION_TYPES.deleteLayers:
      return deleteLayers(prevState, payload);
    case ACTION_TYPES.renameLayers:
      return renameLayers(prevState, payload);
    case ACTION_TYPES.copyLayers:
      return copyLayers(prevState, payload);
    case ACTION_TYPES.changeLayer:
      return changeLayer(prevState, payload);
    case ACTION_TYPES.initPageBrickdState:
      return initPageBrickdState(prevState, payload);
  }
  const layerName = get(prevState, 'layerName');
  if (!layerName) return prevState;
  const state = get(prevState, layerName, legoState) as StateType;
  let newState: StateType;
  switch (type) {
    case ACTION_TYPES.addComponent:
      newState = addComponent(state);
      break;
    case ACTION_TYPES.clearChildNodes:
      newState = clearChildNodes(state);
      break;
    case ACTION_TYPES.onLayoutSortChange:
      newState = onLayoutSortChange(state, payload);
      break;
    case ACTION_TYPES.deleteComponent:
      newState = deleteComponent(state);
      break;
    case ACTION_TYPES.copyComponent:
      newState = copyComponent(state);
      break;
    case ACTION_TYPES.clearHovered:
      newState = clearHovered(state);
      break;
    case ACTION_TYPES.overTarget:
      newState = overTarget(state, payload);
      break;
    case ACTION_TYPES.changePlatform:
      newState = changePlatform(state, payload);
      break;
    case ACTION_TYPES.changeProps:
      newState = changeProps(state, payload);
      break;
    case ACTION_TYPES.selectComponent:
      newState = selectComponent(state, payload);
      break;
    case ACTION_TYPES.clearSelectedStatus:
      newState = clearSelectedStatus(state);
      break;
    case ACTION_TYPES.changeStyles:
      newState = changeStyles(state, payload);
      break;
    case ACTION_TYPES.undo:
      newState = undo(state);
      break;
    case ACTION_TYPES.redo:
      newState = redo(state);
      break;
    case ACTION_TYPES.resetProps:
      newState = resetProps(state);
      break;
    case ACTION_TYPES.resetStyles:
      newState = resetStyles(state);
      break;
    case ACTION_TYPES.resizeChange:
      newState = resizeChange(state, payload);
      break;
    case ACTION_TYPES.setComponentState:
      newState = setComponentState(state, payload);
      break;
    case ACTION_TYPES.setApi:
      newState = setApi(state, payload);
      break;
    case ACTION_TYPES.setStateDomain:
      newState = setStateDomain(state, payload);
      break;
    case ACTION_TYPES.restStateDomain:
      newState = restStateDomain(state, payload);
      break;

    default:
      return prevState;
  }
  if (newState === state) return prevState;
  return { ...prevState, [layerName]: newState };
};
