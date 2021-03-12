import { FetcherType } from '@brickd/utils';
import { ComponentSchemaType } from './ComponentSchemaTypes';

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
}

export enum NODE_PROPS_TYPES {
  reactNode = 'reactNode',
  functionReactNode = 'functionReactNode',
}

/**
 * 全局配置类型定义
 */
interface ComponentsMapType {
  [componentName: string]: any;
}

export type ComponentSchemasMapType = {
  [componentName: string]: ComponentSchemaType;
};

export interface ConfigType {
  componentsMap: ComponentsMapType; //所有的React原始组件
  //所有的组件配置汇总
  componentSchemasMap: ComponentSchemasMapType;
  fetcher?: FetcherType;
}
