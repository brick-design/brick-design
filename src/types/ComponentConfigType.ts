import { PROPS_TYPES } from '@/types/ConfigTypes';

export interface PropsConfigType {
  [propName:string]:PropInfoType
}

export interface PropInfoType {
  label:string,
  type:PROPS_TYPES|PROPS_TYPES[],
  tip?:string,
  childPropsConfig?:PropsConfigType|PropsConfigType[],
  isAdd?:boolean,
  rules?:any[],
  placeholder?:string,
  enumData?:string[],
  defaultValue?:any,
  hasUnit?:boolean,
  isShowColor?:boolean,
  inputColProps?:any,
  maxTagCount?:number,
  min?:number,
  max?:number,
  stringCount?:number,
  formItemProps?:any

}


export interface NodePropsConfigType {
  [propName: string]: {
    type: PROPS_TYPES.reactNode | PROPS_TYPES.functionReactNode,
    tip?:string,
    label?:string,
    childNodesRule?: string[],
    isRequired?:boolean,
    isOnlyNode?:boolean,
    params?:string[]
  },
}

export interface MirrorModalFieldType {
  displayPropName:string,
  mounted?:{
    propName:string,
    type:PROPS_TYPES.function|PROPS_TYPES.string
  }
  style?:any

}

export interface ComponentConfigType {
  parentNodesRule?:string[],
  nodePropsConfig?: NodePropsConfigType,
  mirrorModalField?:MirrorModalFieldType,
  propsConfig:PropsConfigType,
}
