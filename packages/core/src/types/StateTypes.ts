import { PropsConfigType } from './ComponentConfigTypes';
import { Action } from 'redux';

export type PropsNodeType= {
    [propName: string]: string[]
}

export type ChildNodesType=string[] | PropsNodeType

export interface ParentNodeInfo {
    parentKey:string,
    parentPropName?:string,
}
export interface VirtualDOMType {
    componentName: string,
    props: any,
    addPropsConfig?: string,
    childNodes?:ChildNodesType
}

export interface SelectedInfoBaseType extends ParentNodeInfo {
    key:string,
    domTreeKeys:string[],
}

export type SelectedInfoType =Omit<SelectedInfoBaseType, 'key'>&{
    selectedKey: string,
    propName?: string,
    style?:any
}

export interface PropsSettingType {
    props: any,
    propsConfig: PropsConfigType,
    mergePropsConfig: PropsConfigType,
    addPropsConfig: PropsConfigType,
}

export interface DragSourceType extends ParentNodeInfo{
    vDOMCollection?: ComponentConfigsType,
    dragKey: string,
}

export interface DropTargetType {
    selectedKey:string
    propName?: string,
    domTreeKeys:string[]
}

export type PlatformStyleType = (number|string)[]

export interface PlatformInfoType {
    isMobile: boolean,
    size: PlatformStyleType,
}
export interface PropsConfigSheetType {
    [componentKey:string]:PropsConfigType
}

export interface ComponentConfigsType{
    [key:string]:VirtualDOMType
}

export interface BrickAction extends Action<string>{
    payload?:any
}

export type UndoRedoType=Partial<Omit<StateType, 'undo'|'redo'>>
export interface StateType {
    componentConfigs:ComponentConfigsType,
    selectedInfo: SelectedInfoType | null,
    propsSetting: PropsSettingType | null,
    undo: UndoRedoType[],
    redo: UndoRedoType[],
    hoverKey: null | string,
    dragSource: DragSourceType | null,
    dropTarget: null | DropTargetType,
    platformInfo: PlatformInfoType,
    // propsConfigSheet?:PropsConfigSheetType
}
