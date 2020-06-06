<h1 align='center'>Brick Design</h1>

[![build status](https://travis-ci.org/brick-design/react-visual-editor.svg?branch=brickd)](https://travis-ci.org/github/brick-design/react-visual-editor)
[![npm version](https://img.shields.io/npm/v/brickd.svg?style=flat-square)](https://www.npmjs.com/package/brickd)
[![npm downloads](https://img.shields.io/npm/dm/brickd.svg?style=flat-square)](https://www.npmjs.com/package/brickd)
[![codecov](https://codecov.io/gh/brick-design/react-visual-editor/branch/brickd/graph/badge.svg)](https://codecov.io/gh/brick-design/react-visual-editor)

## 特性

- :fire:**任意拖拽嵌套**：通过组件预览面板拖拽组件，到设计面板实现任意嵌套，或者拖拽到DomTree中指定容器节点，DomTree与设计面板中的组件也可随意拖拽嵌套
- :computer:**实时预览**：设计面板中会实时展示组件的属性效果和样式效果，并且与真实页面无异，所见即所得
- :christmas_tree:**DomTree展示**：页面组件dom树的展示并实现组件dom实时追踪
- :gift:**可视化属性配置**：结合React 特性和JS语法定制了可视化的组件属性配置，实现复杂数据结构的可视化配置
- :fireworks:**可视化样式配置**：通过样式配置面板修改样式，实时在页面中显示样式效果
- :video_camera:**模板功能**：可以选中局部或者整个页面做为可复用的模板，提高页面配置效率减少重复工作
- :lock:**组件约束**：根据组件特性，可以配置组件的父组件约束与子组件约束，解决组件间的错误嵌套和报错
- :eyeglasses:**预览与代码生成**：可随时预览页面的真实效果，和页面的jsx代码与样式代码
- :four_leaf_clover:**多平台支持** ：支持PC与移动端多型号设配切换展示
- :dvd:**组件库替换**：通过简单的配置可以对接任何React组件库

## SNAPSHOT
![mobile](packages/docs/mobile.png)

![PC](packages/docs/pc.png)

![Code](packages/docs/Code.png)

###  📦 Install
```sh
yarn add brickd brickd-core bricks-web
```

```bash
npm install brickd brickd-core bricks-web
```
## Usage
```jsx
import { LegoProvider } from 'brickd-core';
import {BrickDesign} from 'brickd';
import {BrickTree,BrickPreview} from 'bricks-web';
const App = () => (
  <LegoProvider config={{...}}>
<div>
    <BrickPreview/>
    <BrickDesign />
<BrickTree/>
</div>
  </LegoProvider>

);
```
And import style manually:

```jsx
import 'bricks-web/dist/index.css';
import 'brickd/dist/index.css';
```
## [example](https://github.com/brick-design/brick-design-demo)


## LICENSE

MIT
