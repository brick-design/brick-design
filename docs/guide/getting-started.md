---
title: 快速上手
order: 9
nav:
  order: 10
---
### 安装组件

```bash
yarn add @brickd/react  @brickd/react-web @brickd/render
```
OR
```bash
npm install @brickd/react @brickd/react-web @brickd/render
```
目前主要是三个库，其中核心库是@brickd/react库，该库包含了brick design的所有能力与功能。剩下的两个库算是扩展库，react-web实现了预览版面板组件、属性配置面板组件、样式配置面板组件，可以说是一个功能组件库集，
@brickd/render是一个渲染库，主要是将编辑操作完的也页面配置使用原始组件重新渲染，你可以不依赖这两个库，实现自己的功能库。
### 在项目中使用
```jsx | pure
import { createElement } from 'react';
import { BrickDesign, BrickTree, BrickProvider, useSelector, createActions,PROPS_TYPES } from '@brickd/react';
import { BrickPreview } from '@brickd/react-web';
import BrickRender from '@brickd/render';
import * as Ants from 'antd/es';
// 组件属性配置信息
const divSchemas= {
   propsConfig:{
      children:{
         label: '文本内容',
         type: PROPS_TYPES.string,
      },
      ...
   }
}
// 组件配置信息集
const componentSchemasMap = {
	'div':divSchemas,
     ...
}
 
//全局配置
const config = {
   componentsMap:Ants,
   componentSchemasMap
}

// 渲染库支持的自定义函数处理集
const plugins = [(vDom, componentConfig) => vDom];
const customReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'customReducer':
      return { ...state }
    default:
      return state
  }
}
const App = () => {
  const { pageConfig } = useSelector(['pageConfig'])

  return (<BrickProvider initState={{...}} customReducer={customReducer} config={config} warn={(msg) => message.warning(msg)}
  >
    <div onClick={() => createActions({ type: "customReducer", payload: { ... } })}> 出发action</div>
    <BrickPreview />
    <BrickDesign />
    <BrickRender pageConfig={pageConfig} createElement={createElement} plugins={plugins} />
    <BrickTree />
  </BrickProvider>);
}
```
