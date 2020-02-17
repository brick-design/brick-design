import { PropsConfigType } from './ComponentConfigType';
import {EffectsCommandMap} from 'dva';
import {AnyAction} from 'redux';

 export interface PropsNodeType{
  [propName:string]:{
    childNodes:VirtualDOMType[]
  }
}

export interface VirtualDOMType {
  key:string,
  componentName:string,
  props:any,
  addPropsConfig?:PropsConfigType,
  childNodes?:VirtualDOMType[]|PropsNodeType

}

export interface SelectedComponentInfoType {
  selectedKey:string,
  style: any,
  parentPath:string,
  componentName:string,
  propName?:string,
  propPath?:string,
  path:string,
  isContainer?:boolean,
  isOnlyNode?:boolean,
  childNodesRule?:string[],
  domTreeKeys?:string[],
  isRequiredHasChild?:boolean
}

export interface PropsSettingType {
  props:any,
  propsConfig:PropsConfigType,
  mergePropsConfig:PropsConfigType,
  addPropsConfig:PropsConfigType,
}

interface DragDataType {
  defaultProps?:any,
  componentName?:string,
  templateData?:VirtualDOMType,
  dragPath?:string,
  dragParentPath?:string
}

export interface TemplateInfoType{
  img:string,
  id:string,
  name:string,
  config:string
}

export interface DropTargetInfoType {
  isContainer:boolean,
  propPath:string,
  path:string,
  isOnlyNode:boolean,
  childNodesRule:string[],
  componentName:string,
  propName:string
}
export interface StateType{
  componentConfigs:VirtualDOMType[],
  selectedComponentInfo:SelectedComponentInfoType|{},
  propsSetting:PropsSettingType|{},
  styleSetting:any,
  undo:any[],
  redo:any[],
  templateInfos:TemplateInfoType[],
  newAddKey:null|string,
  hoverKey:null|string,
  dragData:DragDataType|null,
  dropTargetInfo:null|DropTargetInfoType

}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

 export type Reducer=(state:StateType,action: AnyAction)=>StateType

export interface ModelType {
  namespace:string,
  state:StateType,
  effects:{
    submitConfigs:Effect,
    searchTemplate:Effect,
    getTemplateList:Effect,
    addTemplateInfo:Effect,
    deleteTemplate:Effect
  },
  reducers:{
    saveTemplateInfos:Reducer;
    addComponent:Reducer,
    copyComponent:Reducer,
    onLayoutSortChange:Reducer,
    clearSelectedStatus:Reducer,
    selectComponent:Reducer,
    clearChildNodes:Reducer,
    deleteComponent:Reducer,
    addPropsConfig:Reducer,
    deletePropsConfig:Reducer,
    changeStyles:Reducer,
    submitProps:Reducer,
    overTarget:Reducer,
    clearHovered:Reducer,
    getDragData:Reducer,
    getDropTargetInfo:Reducer,
    undo:Reducer,
    redo:Reducer,

  }

}
