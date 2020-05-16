import {StateType} from "../types";
import ACTION_TYPES from '../actions/actionTypes';
import {
    addComponent,
    clearChildNodes,
    onLayoutSortChange,
    deleteComponent,
    copyComponent
} from "./handleComponentConfig";
import {getDragSource, getDropTarget} from "./handleDragDrop";
import {clearHovered, overTarget} from "./handleHover";
import {changePlatform} from "./handlePlatform";
import {addPropsConfig, deletePropsConfig, submitProps} from "./handleProps";
import {clearSelectedStatus, selectComponent} from "./handleSelectedComponent";
import {changeStyles} from "./handleStyles";
import {Reducer} from "redux";

export  const reducer:Reducer=function(state:StateType,action:any){
    const {type,payload}=action
    switch (type) {
        case ACTION_TYPES.addComponent:
            return addComponent(state);
        case ACTION_TYPES.clearChildNodes:
            return clearChildNodes(state);
        case ACTION_TYPES.onLayoutSortChange:
           return  onLayoutSortChange(state,payload);
        case ACTION_TYPES.deleteComponent:
            return deleteComponent(state);
        case ACTION_TYPES.copyComponent:
            return copyComponent(state);
        case ACTION_TYPES.getDragSource:
            return getDragSource(state,payload);
        case ACTION_TYPES.getDropTarget:
            return getDropTarget(state,payload);
        case ACTION_TYPES.clearHovered:
            return clearHovered(state);
        case ACTION_TYPES.overTarget:
            return overTarget(state,payload);
        case ACTION_TYPES.changePlatform:
            return changePlatform(state,payload);
        case ACTION_TYPES.addPropsConfig:
            return  addPropsConfig(state,payload);
        case ACTION_TYPES.deletePropsConfig:
            return deletePropsConfig(state,payload);
        case ACTION_TYPES.submitProps:
            return submitProps(state,payload);
        case ACTION_TYPES.selectComponent:
            return selectComponent(state,payload);
        case ACTION_TYPES.clearSelectedStatus:
            return clearSelectedStatus(state);
        case ACTION_TYPES.changeStyles:
            return changeStyles(state,payload);
        default:
            return  state

    }
}

