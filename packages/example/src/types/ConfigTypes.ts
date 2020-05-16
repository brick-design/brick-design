import { CategoryType } from '@/types/CategoryType';
import { ComponentConfigType } from '@/types/ComponentConfigType';

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
  boolean = 'boolean',
  reactNode = 'reactNode',
  functionReactNode = 'functionReactNode',
  animate = 'animate',
}

/**
 * 样式类型定义
 */
export enum CSS_TYPE {
  string = 'string',
  enum = 'enum',
  number = 'number',
};


/**
 * 全局配置类型定义
 */
export interface ConfigType {
  OriginalComponents: any, //所有的React原始组件
  CONTAINER_CATEGORY: CategoryType,  //容器组件分类
  NON_CONTAINER_CATEGORY: CategoryType, //非容器组件分类
  //所有的组件配置汇总
  AllComponentConfigs: { [componentName: string]: ComponentConfigType },
  iframeSrcDoc: string
}
