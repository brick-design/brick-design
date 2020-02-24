import { PROPS_TYPES } from '@/types/ConfigTypes';

export interface PropsConfigType {
  [propName:string]:PropInfoType
}

export interface PropInfoType {
  label:string,  //属性展示
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

/**
 * 弹窗类组件配置显示映射
 */
export interface MirrorModalFieldType {
  displayPropName:string,  // 控制显示的属性字段（比如：Modal的visible）
  mounted:{      // 挂载组件的配置信息
    propName:string,  //挂载组件的属性的名 (比如Modal的getContainer)
    type:PROPS_TYPES.function|PROPS_TYPES.string //挂载组件的属性的类型
  }
  style?:any // 需要修改样式才能挂载的情况（Drawer组件起默认样式为 position: 'fixed',无法挂载到设计面板上，需要改成 position: 'absolute'）

}

export interface ComponentConfigType {
  parentNodesRule?:string[],
  nodePropsConfig?: NodePropsConfigType,
  mirrorModalField?:MirrorModalFieldType,
  propsConfig:PropsConfigType,
}
