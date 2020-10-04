---
title: BrickDesign
order: 9
nav:
  order: 10
---

### 介绍

BrickDesign作为brick design 编辑器的核心组件，也就是画板或者页面编辑组件，包含页面编辑，实时预览、辅助线、拖拽大小、拖拽嵌套等功能。
依赖于BrickProvider，所以应该作为BrickProvider的子组件或者子孙组件使用。

### 属性
#### onLoadEnd()
onLoadEnd iframe的加载完毕方法，也标明BrickDesign加载完毕可以进编辑等操作,如果你需要在BrickDesign加载完毕后做一些其他事情，请在这里处理。

