---
title: state相关
order: 9
nav:
  order: 10
---

### createAction({type,payload})
createAction 生成一个redux action 并触发。如果你在BrickProvider写了自定义的reducer那么你就需要使用createAction来触发你的reducer，
该方法必须返回state。方法参数为action对象。

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| type | string | action type用户区分action |
| payload | any | 不限类型用于携带数据，最终在自定义redux会获取到 |

### produce()
brick design使用[immer](https://immerjs.github.io/immer/docs/introduction)做不可变数据，保证状态唯一性。所以在自定义reducer中处理state
时需要使用produce

### original()
brick design使用[immer](https://immerjs.github.io/immer/docs/introduction)做不可变数据，导致使用console.log()时无法查看state具体数据。
需要使用original来还原展示

### LEGO_BRIDGE
LEGO_BRIDGE 是一个redux store桥接象。你可以在任何地方通过LEGO_BRIDGE获取brick design的redux  store对象，想要重置brick design可将
store置位null，即LEGO_BRIDGE.store=null,**注意**LEGO_BRIDGE.store初始默认值为null，一经生成在不手动更改的前提保持引用不变。


