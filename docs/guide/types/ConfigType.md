---
title: ConfigType
order: 9
nav:
  order: 10
---
定义

```ts
interface ConfigType {
	OriginalComponents: OriginalComponentsType //所有的React原始组件
	//所有的组件配置汇总
	AllComponentConfigs: AllComponentConfigsType
	containers: string[]
	warn?: (msg: string) => void
}
```
### OriginalComponents
所有React原始组件集合，主要供预览与页面编辑区识别并获取组件
##### OriginalComponentsType
定义
```ts
interface OriginalComponentsType {
	[componentName: string]: any
}
```
所有拖拽组件的集合。
### AllComponentConfigs
所有拖拽组件的配置信息集合

##### AllComponentConfigsType
定义
```ts
type AllComponentConfigsType = {
	[componentName: string]: ComponentConfigTypes
}
```
[ComponentConfigTypes](./component-config-types)
### containers
所有容器组件名的数组集合

### warn
警告回调方法，当某些组件触发父子组件约束时会执行该方法。

