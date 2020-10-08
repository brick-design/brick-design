---
title: ConfigType
order: 9
nav:
  order: 10
---
定义

```ts
interface ConfigType {
	componentsMap: ComponentsMapType //所有的React原始组件
    	//所有的组件配置汇总
   componentSchemasMap: ComponentSchemasMapType
}
```
### componentsMap
所有React原始组件集合，主要供预览与页面编辑区识别并获取组件
##### ComponentsMapType
定义
```ts
interface ComponentsMapType {
	[componentName: string]: any
}
```
所有拖拽组件的集合。
### componentSchemasMap
所有拖拽组件的配置信息集合

##### ComponentSchemasMapType
定义
```ts
type ComponentSchemasMapType = {
	[componentName: string]: ComponentSchemaType
}
```
[ComponentSchemaType](./component-schema-types)

