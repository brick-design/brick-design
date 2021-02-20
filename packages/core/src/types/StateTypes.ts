import { Action } from 'redux';
import { ActionType, Api } from '@brickd/utils';
import { PropInfoType, PropsConfigType } from './ComponentSchemaTypes';

export type PropsNodeType = {
	[propName: string]: string[] | undefined
}

export type PlainObjectType={[key:string]:any}

export type ChildNodesType = string[] | PropsNodeType

export interface ParentNodeInfo {
	parentKey: string
	parentPropName?: string
}



export type ApiType=Api[]|Api



export type PropsType={
	[propName:string]:ActionType|any
}

export interface VirtualDOMType {
	componentName: string
	props?: PropsType
	childNodes?: ChildNodesType
	api?:ApiType
	state?:PlainObjectType
	isRender?:string
	[custom: string]: any
}

export interface SelectedInfoBaseType extends ParentNodeInfo {
	key: string
	domTreeKeys: string[]
}

export type SelectedInfoType = Omit<SelectedInfoBaseType, 'key'> & {
	selectedKey: string
	propName?: string
	props?: any
	propsConfig: PropsConfigType
}

export interface DragSourceType extends Partial<ParentNodeInfo> {
	vDOMCollection?: PageConfigType
	dragKey?: string
	propsConfigCollection?: PropsConfigSheetType
}

export interface DropTargetType {
	selectedKey: string
	propName?: string
	domTreeKeys: string[]
}

export type PlatformStyleType = (number | string)[]

export interface PlatformInfoType {
	isMobile: boolean
	size: PlatformStyleType
}

export interface PropsConfigSheetALL {
	[propName: string]: Partial<PropsConfigSheetItem>
}

export interface PropsConfigSheetItem
	extends Omit<PropInfoType, 'childPropsConfig'> {
	childPropsConfig?: PropsConfigSheetALL | PropsConfigSheetALL[]
}

export interface PropsConfigSheetType {
	[componentKey: string]: PropsConfigSheetALL
}

export interface PageConfigType {
	[key: string]: VirtualDOMType
}

export interface BrickAction extends Action<string> {
	payload?: any
}

export type UndoRedoType = Partial<Omit<StateType, 'undo' | 'redo'>>

export type PageStateConfigType={
	state?:PlainObjectType
	api?:ApiType
}

export interface StateType {
	pageState:PlainObjectType
	pageConfig: PageConfigType
	selectedInfo: SelectedInfoType | null
	undo: UndoRedoType[]
	redo: UndoRedoType[]
	hoverKey: null | string
	dragSource: DragSourceType | null
	dropTarget: null | DropTargetType
	platformInfo: PlatformInfoType
	propsConfigSheet: PropsConfigSheetType
	pageStateConfig:PageStateConfigType
}

export type STATE_PROPS = keyof StateType
