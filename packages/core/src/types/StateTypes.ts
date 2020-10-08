import { Action } from 'redux';
import { PropInfoType, PropsConfigType } from './ComponentSchemaTypes';

export type PropsNodeType = {
	[propName: string]: string[] | undefined
}

export type ChildNodesType = string[] | PropsNodeType

export interface ParentNodeInfo {
	parentKey: string
	parentPropName?: string
}

export interface VirtualDOMType {
	componentName: string
	props?: any
	addPropsConfig?: string
	childNodes?: ChildNodesType

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

export interface StateType {
	pageConfig: PageConfigType
	selectedInfo: SelectedInfoType | null
	undo: UndoRedoType[]
	redo: UndoRedoType[]
	hoverKey: null | string
	dragSource: DragSourceType | null
	dropTarget: null | DropTargetType
	platformInfo: PlatformInfoType
	propsConfigSheet: PropsConfigSheetType
}

export type STATE_PROPS = keyof StateType
