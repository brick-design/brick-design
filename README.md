<h1 align='center'>Brick Design</h1>

[![build status](https://travis-ci.org/brick-design/react-visual-editor.svg?branch=brickd)](https://travis-ci.org/github/brick-design/react-visual-editor)
[![npm version](https://img.shields.io/npm/v/@brickd/react.svg?style=flat-square)](https://www.npmjs.com/package/brickd)
[![npm downloads](https://img.shields.io/npm/dm/@brickd/react.svg?maxAge=43200&style=flat-square)](https://www.npmjs.com/package/brickd)
[![codecov](https://codecov.io/gh/brick-design/react-visual-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/brick-design/react-visual-editor)

## SNAPSHOT

[comment]: <> "![brickd1]&#40;https://user-images.githubusercontent.com/15995127/85188005-7e4de100-b2d6-11ea-9441-2bd5570b14a9.gif&#41;"

[comment]: <> "![brickd2]&#40;https://user-images.githubusercontent.com/15995127/85187856-86595100-b2d5-11ea-883e-e45313797fb3.gif&#41;"

[comment]: <> "![brickd3]&#40;https://user-images.githubusercontent.com/15995127/85187862-92451300-b2d5-11ea-8394-a6c06b45de97.gif&#41;"

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
import { BrickDesign, BrickTree, BrickProvider, useSelector, createActions,PROPS_TYPES } from '@brickd/react';
import { BrickPreview } from '@brickd/react-web';
import BrickRender from '@brickd/render';
import * as Ants from 'antd/es';
const divSchema = {
   propsConfig:{
      children:{
         label: '文本内容',
         type: PROPS_TYPES.string,
      },
      ...
   }
}
const componentSchemasMap = {
	'div':divSchema,
     ...
}
 
const config = {
   componentsMap:Ants,
   componentSchemasMap
}
const plugins = [(vDom, componentSchema) => vDom];
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

  return (<BrickProvider initState={{...}} customReducer={customReducer} config={config} warn={(msg) =>console.warning(msg)}
  >
    <div onClick={() => createActions({ type: "customReducer", payload: { ... } })}> 出发action</div>
    <BrickPreview />
    <BrickDesign />
    <BrickRender pageConfig={pageConfig} createElement={createElement} plugins={plugins} />
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

| 画布                                                         | 组件树                        | 属性配置                      | 样式配置            | 高级配置                           | 渲染器              | 代码生成器           |
| ------------------------------------------------------------ | ----------------------------- | ----------------------------- | ------------------- | ---------------------------------- | ------------------- | -------------------- |
| :heart:操作：参考线展示、组件间距实时查看、拖拽改变组件宽高  | 组件-复制                     | :heart:普通属性配置（待重做） | 支持所有Css样式     | 支原生事件方法自定                 | :heart:完全还原渲染 | 完代码生成           |
| :heart:弹窗类组件：选中展示                                  | 组件-删除                     | 变量配置                      | 组件样式定制        | 支dsl方法选择                      | dsl支持             | 完画布与代码相互转换 |
| 自由拖拽：绝对布局自由拖拽调整位置                           | 组件-清空                     | 表达式配置                    | 样式变量支持        | 支手写自定义方法：执行生命周期规则 |                     | 完画布与代码实时交互 |
| :heart:拖拽实时预览                                          | 主域组件分类标记              |                               | 手写样式支持        |                                    |                     |                      |
| :heart:组件: 复制、删除、清空子组件                          | :heart:拖拽-同级排序          |                               | :heart:样式实时预览 |                                    |                     |                      |
| :heart:拖拽:实时预览、实时排序、自由嵌套、属性节点区分       | :heart:拖拽-跨组件排序        |                               |                     |                                    |                     |                      |
| :heart:模板：生成、添加、模板截图                            | :heart:画板协同-选中实时协同  |                               |                     |                                    |                     |                      |
| :heart:快速预览                                              | :heart:画板协同-hover实时协同 |                               |                     |                                    |                     |                      |
| :heart:撤销、重做                                            |                               |                               |                     |                                    |                     |                      |
| 样式可视化操作：实时预览                                     |                               |                               |                     |                                    |                     |                      |
| 属性可视化操作                                               |                               |                               |                     |                                    |                     |                      |
| 自定义组件：组件协议自动生成                                 |                               |                               |                     |                                    |                     |                      |
| :heart:父子组件约束限制：红色-禁止添加、黄色-提示可添加、绿色-可添加 |                               |                               |                     |                                    |                     |                      |
| :heart:组件对象(vDom)扩展                                    |                               |                               |                     |                                    |                     |                      |
| :heart:自定义reducer处理页面状态                             |                               |                               |                     |                                    |                     |                      |
| :heart:组件渲染：逻辑渲染、Map渲染、方法渲染                 |                               |                               |                     |                                    |                     |                      |
| :heart:数据：状态域、变量                                    |                               |                               |                     |                                    |                     |                      |
| 逻辑：自定义方法、数据映射、变量过滤器                       |                               |                               |                     |                                    |                     |                      |
| :heart:平台支持:PC各型号手机                                 |                               |                               |                     |                                    |                     |                      |
| 声明周期：初始化执行、每次渲染执行                           |                               |                               |                     |                                    |                     |                      |
| dsl: dsl插件支持                                             |                               |                               |                     |                                    |                     |                      |
| plugin：插件扩展                                             |                               |                               |                     |                                    |                     |                      |
| 标尺展示                                                     |                               |                               |                     |                                    |                     |                      |
| 组件：样式就近操作                                           |                               |                               |                     |                                    |                     |                      |
| :heart:React                                                 |                               |                               |                     |                                    |                     |                      |
| Rax                                                          |                               |                               |                     |                                    |                     |                      |


### 技术交流 QQ群

 <img src="https://user-images.githubusercontent.com/15995127/112433279-fb821700-8d7c-11eb-9b86-da2b0f317b1f.jpeg" width="140" />

### 捐赠作者

如果你觉得这个项目对你有用或者有所启发，可以请作者喝杯咖啡提提神持续更新：

| 微信捐赠  | 支付宝捐赠
|---|---|
| <img src="https://user-images.githubusercontent.com/15995127/111981180-4bc16500-8b42-11eb-8376-60c16e415a8f.png" width="140" />| <img src="https://user-images.githubusercontent.com/15995127/111981247-61368f00-8b42-11eb-82f1-dbe47ca64682.jpeg" width="140" />

## LICENSE

MIT
