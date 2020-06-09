import { BrickAction, StateType } from '../types';
import ACTION_TYPES from '../actions/actionTypes';
import {
  addComponent,
  clearChildNodes,
  copyComponent,
  deleteComponent,
  onLayoutSortChange,
} from './handleComponentConfig';
import { clearDropTarget, getDragSource, getDropTarget } from './handleDragDrop';
import { clearHovered, overTarget } from './handleHover';
import { changePlatform } from './handlePlatform';
import { addPropsConfig, changeProps, deletePropsConfig, resetProps } from './handleProps';
import { clearSelectedStatus, selectComponent } from './handleSelectedComponent';
import { changeStyles, resetStyles } from './handleStyles';
import { redo, undo } from './handleRedoUndo';
import { Reducer } from 'redux';


export const reducer: Reducer<StateType, BrickAction> = (prevState, action) => {
  const state = prevState as StateType;
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.addComponent:
      return addComponent(state);
    case ACTION_TYPES.clearChildNodes:
      return clearChildNodes(state);
    case ACTION_TYPES.onLayoutSortChange:
      return onLayoutSortChange(state, payload);
    case ACTION_TYPES.deleteComponent:
      return deleteComponent(state);
    case ACTION_TYPES.copyComponent:
      return copyComponent(state);
    case ACTION_TYPES.getDragSource:
      return getDragSource(state, payload);
    case ACTION_TYPES.getDropTarget:
      return getDropTarget(state, payload);
    case ACTION_TYPES.clearHovered:
      return clearHovered(state);
    case ACTION_TYPES.overTarget:
      return overTarget(state, payload);
    case ACTION_TYPES.changePlatform:
      return changePlatform(state, payload);
    case ACTION_TYPES.addPropsConfig:
      return addPropsConfig(state, payload);
    case ACTION_TYPES.deletePropsConfig:
      return deletePropsConfig(state, payload);
    case ACTION_TYPES.changeProps:
      return changeProps(state, payload);
    case ACTION_TYPES.selectComponent:
      return selectComponent(state, payload);
    case ACTION_TYPES.clearSelectedStatus:
      return clearSelectedStatus(state);
    case ACTION_TYPES.changeStyles:
      return changeStyles(state, payload);
    case ACTION_TYPES.undo:
      return undo(state);
    case ACTION_TYPES.redo:
      return redo(state);
    case ACTION_TYPES.resetProps:
      return resetProps(state);
    case ACTION_TYPES.resetStyles:
      return resetStyles(state);
    case ACTION_TYPES.clearDropTarget:
      return clearDropTarget(state);
    default:
      return state;

  }
};

