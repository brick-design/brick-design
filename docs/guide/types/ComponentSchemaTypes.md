---
title: ComponentSchemaType
order: 9
nav:
  order: 10
---

### 定义
```ts
interface ComponentSchemaType {
    isNonContainer?:boolen
	childNodesRule?: string[]
	fatherNodesRule?: string[]
	nodePropsConfig?: NodePropsConfigType
	mirrorModalField?: MirrorModalFieldType
	propsConfig: PropsConfigType
    isRequired?: boolean
	isOnlyNode?: boolean
}

```
### isNonContainer
是否为非容易，如果是非容器将该属性设置为true，否则不设置值或者设置为false
### childNodesRule
子组件约束，内容为允许放置的组件名称集合，如果childNodesRule设置在配置信息个根节点下，那么约束的就是children属性下的子组件，当如是在
节点属性配置中设置的约束就为该节点属性所允许放置的组件名称集合。
### fatherNodesRule
父组件约束，约定改组件允许作为父组件约束范围内用的子节点或者节点属性的字节点。

### nodePropsConfig
子节点属性配置，主要配置节点属性的相关信息，供BrickDesign和BrickTree组件识别。

### mirrorModalField
弹窗类组件属性字段映射，设置弹窗类组件属性映射后，会将弹窗组件渲染到iframe中，并可在选中弹窗组件或者其子组件时控制弹窗展示。
### propsConfig
属性配置，主要做组件的属性配置信息，主要供属性配置面板识别展示相应的可视化属性操作组件，如果属性配置中包含了节点属性的属性名，
那么优先级在节点属性有子节点的情况下，节点属性的取值优先级为：子节点>普通值。否则取普通值。
### isRequired
子节点是否为必填，或者说组件不可以没有子节点。如果isRequired设置在配置信息个根节点下，那么就表示children属性下的子组件不可以为空，
如是在节点属性配置中设置的isRequired就表示该节点属性不可为空。
### isOnlyNode
子节点是否唯一，或者说组件的子节点或者节点属性的子节点必须为单一根节点。如果isOnlyNode设置在配置信息个根节点下，那么就表示children属性下的子组件为单一根节点组件，
如是在节点属性配置中设置的isOnlyNode就表示该节点属性下的子组件为单一根节点组件。


