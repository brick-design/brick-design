---
title: BrickProvider
order: 9
nav:
  order: 10
---

### 介绍

BrickProvider作为brick design 编辑器的根组件，将处理好的状态，传到给所有需要的组件。

### 属性
#### initState
initState 初始化页面非必填。
	

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| componentConfigs | object | 页面配置信息 |


#### customReducer(state,action)
customReducer 自定义reducer，扩展处理redux state,可以获取所有state状态
```js
const customReducer=(state,action)=>{
const {type,payload}=action
switch (type){
case 'customReducerType':
return {...state}
default:
return state
}
}
```
#### config
[config](../../guide/configs) 全局总配置
