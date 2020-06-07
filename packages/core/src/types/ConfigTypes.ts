import { CategoryType } from './CategoryTypes';
import { ComponentConfigTypes } from './ComponentConfigTypes';
/**
 * 属性类型定义
 */
export enum PROPS_TYPES {
  object = 'object',
  objectArray = 'objectArray',
  function = 'function',
  number = 'number',
  numberArray = 'numberArray',
  string = 'string',
  stringArray = 'stringArray',
  enum = 'enum',
  json = 'json',
  boolean = 'boolean'
}
export enum NODE_PROPS_TYPES{
  reactNode = 'reactNode',
  functionReactNode = 'functionReactNode',
}

export type ALL_TYPE=PROPS_TYPES|NODE_PROPS_TYPES
/**
 * 全局配置类型定义
 */
interface OriginalComponentsType{
  [componentName:string]:any
}

export interface ConfigType {
  OriginalComponents: OriginalComponentsType, //所有的React原始组件
  CONTAINER_CATEGORY: CategoryType,  //容器组件分类
  NON_CONTAINER_CATEGORY: CategoryType, //非容器组件分类
  //所有的组件配置汇总
  AllComponentConfigs: { [componentName: string]: ComponentConfigTypes },
}
