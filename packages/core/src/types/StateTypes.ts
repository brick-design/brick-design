import { PropsConfigType } from './ComponentConfigTypes';

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

export interface SelectedInfoType extends ParentNodeInfo{
    selectedKey: string,
    propName?: string,
    domTreeKeys?: string[],


}

export interface PropsSettingType {
    props: any,
    propsConfig: PropsConfigType,
    mergePropsConfig: PropsConfigType,
    addPropsConfig: PropsConfigType,
}

export interface DragSourceType extends ParentNodeInfo{
    vDOMCollection?: ComponentConfigsType,
    dragKey?: string,
    defaultProps?:any
}

export interface TemplateInfoType {
    img: string,
    id: string,
    name: string,
    config: string
}

export interface DropTargetType {
    selectedKey:string
    propName: string,
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

export interface StateType {
    componentConfigs:ComponentConfigsType,
    selectedInfo: SelectedInfoType | null,
    propsSetting: PropsSettingType | null,
    styleSetting: any,
    undo: any[],
    redo: any[],
    templateInfos: TemplateInfoType[],
    hoverKey: null | string,
    dragSource: DragSourceType | null,
    dropTarget: null | DropTargetType,
    platformInfo: PlatformInfoType,
    propsConfigSheet?:PropsConfigSheetType
}
