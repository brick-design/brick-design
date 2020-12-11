<h1 align='center'>Brick Design</h1>

[![build status](https://travis-ci.org/brick-design/react-visual-editor.svg?branch=brickd)](https://travis-ci.org/github/brick-design/react-visual-editor)
[![npm version](https://img.shields.io/npm/v/@brickd/react.svg?style=flat-square)](https://www.npmjs.com/package/brickd)
[![npm downloads](https://img.shields.io/npm/dm/@brickd/react.svg?maxAge=43200&style=flat-square)](https://www.npmjs.com/package/brickd)
[![codecov](https://codecov.io/gh/brick-design/react-visual-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/brick-design/react-visual-editor)

## SNAPSHOT
![brickd1](https://user-images.githubusercontent.com/15995127/85188005-7e4de100-b2d6-11ea-9441-2bd5570b14a9.gif)
![brickd2](https://user-images.githubusercontent.com/15995127/85187856-86595100-b2d5-11ea-883e-e45313797fb3.gif)
![brickd3](https://user-images.githubusercontent.com/15995127/85187862-92451300-b2d5-11ea-8394-a6c06b45de97.gif)

## 描述
基于React组件之间原始约束设计，还原真实开发中组件编码过程，所见即所得。当前版本还在开发中，新功能持续更新.....欢迎关注！


###  📦 Install
```sh
yarn add @brickd/react  @brickd/react-web @brickd/render
```
OR
```sh
npm install @brickd/react @brickd/react-web @brickd/render
```
## Usage
```jsx
import { createElement } from 'react';
import { BrickDesign, BrickTree, BrickProvider, useSelector, createActions } from '@brickd/react';
import { BrickPreview } from '@brickd/react-web';
import BrickRender from '@brickd/render';
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
  const { componentConfigs } = useSelector(['componentConfigs'])

  return (<BrickProvider initState={{}} customReducer={customReducer} config={{ ...componentConfigs }}>
    <div onClick={() => createActions({ type: "customReducer", payload: { ...componentConfigs } })}> 出发action</div>
    <BrickPreview />
    <BrickDesign />
    <BrickRender componentConfigs={componentConfigs} createElement={createElement} plugins={plugins} />
    <BrickTree />
  </BrickProvider>);
}
```
### run example

```
yarn  install

npm run start:example
```
### Features
1. 画布
    - [x] 参考线
    - [x] 组件间距查看
    - [x] 拖拽改变组件形状
    - [x] 拖拽实时预览
    - [x] 组件: 复制
    - [x] 组件: 删除
    - [x] 父组件: 清除子组件
    - [ ] 组件排序 
    - [x] 模板：生成
    - [x] 模板：添加
    - [x] 快速预览
    - [x] 撤销、重做
    - [x] 样式可视化操作实时预览
    - [x] 组件自由拖拽嵌套
    - [x] 父子组件约束
    - [x] 组件对象(vDom)扩展
    - [x] 自定义reducer处理页面状态
    - [ ] 组件逻辑判断
    - [x] React
    - [ ] rax
    
2. 组件树
    - [x] 组件: 复制
    - [x] 组件: 删除
    - [x] 父组件: 清除子组件
    - [x] 同级组件排序 
    - [x] 模板：生成
    - [x] 模板：添加 
    - [x] 拖拽添加组件
    - [x] 拖拽跨组件排序
    - [x] 与画布实时映射

3. 渲染器
    - [x] 支持react
    - [x] 支持rax
    - [x] 支持plugins处理组件

4. 代码生成器
   - [ ] 代码生成
   - [ ] 画布与代码相互转换
   - [ ] 画布与代码实时交互

### 技术交流

 <img src="./docs/QQ.jpeg" width="300" />

## LICENSE

MIT
