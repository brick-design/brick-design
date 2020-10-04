---
title: 全局总配置
order: 9
nav:
  order: 10
---
### 介绍
全局总配置供brick design各个功能组件全局使用，包括组件配置集合、组件集合、warn回调、以及容器组件集合。

```ts
import { reactContainers, reactNonContainers } from './reactCategory'
import * as Ants from 'antd/es'
import AllComponentConfigs from './componentConfigs'
import { ConfigType } from '@brickd/react'
import { message } from 'antd'

/**
 * 容器组件分类
 */
export const CONTAINER_CATEGORY = { ...reactContainers, ...htmlContainers }
/**
 * 非容器组件分类
 * @type {{Input, InputNumber, Slider, Checkbox, Rate, Radio, Icon, Typography}}
 */
export const NON_CONTAINER_CATEGORY = {
	...reactNonContainers,
	...htmlNonContainers,
}


const config: ConfigType = {
	OriginalComponents: Ants,
	AllComponentConfigs,
	containers: flattenDeepArray(CONTAINER_CATEGORY),
	warn: (msg: string) => {
		message.warning(msg)
	},
}

export default config
```

### OriginalComponents 所有组件集合
OriginalComponents 包含了拖拽组成页面的所有组件集合，如果有自定义组件，可以如下这样写,一定要记住属性组件名大写字母开头。
```ts
const config: ConfigType = {
	OriginalComponents: {...Ants,CustomComponet:CustomComponet},
	...
}
```
### AllComponentConfigs 所有组件配置集合
AllComponentConfigs 包含了拖拽组成页面的所有组件的配置信息集合，其中的配置信息与组件集合中的组件一一对应，
主要供可视化属性配置组件正确理解组件属性的输入展示，以及编辑区域执行组件的约束条件，保证组件的正确嵌套组合。

### containers 所有的容器组件的组件名
containers 只是一个简单的一位字符串数组，包含了所有的容器组件的名称。主要供brick design分辨组件的类型。

### warn 警告回到函数
warn主要是为了告诉用户组件触发了某些组件约束导致无法完成拖拽嵌套。是一个回到函数，参数是只有一个 message 警告信息。
