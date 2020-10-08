---
title: 全局总配置
order: 9
nav:
  order: 10
---
### 介绍
全局总配置供brick design各个功能组件全局使用，包括组件配置集合、组件集合、warn回调、以及容器组件集合。

```ts
import * as Ants from 'antd/es'
import componentSchemas from './componentSchemas'
import { ConfigType } from '@brickd/react'

/**
 * 设计面板iframe 模板，如果集成到项目中，需要将拖拽组件所依赖的样式在模板中设置，
 * 否则设计面板渲染的页面将是无样式的效果
 */
const config: ConfigType = {
	componentsMap: Ants,
	componentSchemasMap:componentSchemas,
}

export default config

```

### componentsMap 所有组件集合
componentsMap 包含了拖拽组成页面的所有组件集合，如果有自定义组件，可以如下这样写,一定要记住属性组件名大写字母开头。
```ts
const config: ConfigType = {
	componentsMap: {...Ants,CustomComponet:CustomComponet},
	...
}
```
### componentSchemasMap 所有组件配置集合
componentSchemasMap 包含了拖拽组成页面的所有组件的配置信息集合，其中的配置信息与组件集合中的组件一一对应，
主要供可视化属性配置组件正确理解组件属性的输入展示，以及编辑区域执行组件的约束条件，保证组件的正确嵌套组合。
