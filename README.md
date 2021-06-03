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

### 快捷键
>command/control+"+"    放大
>
>command/control+"-"    缩小
>
>command/control+U      全局查看与窗口查看切换
>
>command/control+z      撤销
>
>command/control+shift+z    回退

### run example

```
yarn  install

npm run start:example
```
### Features

| 画布                                                         | 组件树                        | 属性配置                      | 样式配置            | 高级配置                           | 渲染器              | 代码生成器           |
| ------------------------------------------------------------ | ----------------------------- | ----------------------------- | ------------------- | ---------------------------------- | ------------------- | -------------------- |
| 【X】-操作：参考线展示、组件间距实时查看、拖拽改变组件宽高  | 【  】-组件-复制                | 【X】-普通属性配置（待重做） | 【  】-支持所有Css样式 | 【  】-支原生事件方法自定            | 【X】-完全还原渲染 | 【  】-完代码生成      |
| 【X】-弹窗类组件：选中展示                                  | 【  】-组件-删除                | 【  】-变量配置                 | 【  】-组件样式定制   | 【  】-支dsl方法选择                 | 【  】-dsl支持        | 【  】-完画布与代码相互转换 |
| 【  】-自由拖拽：绝对布局自由拖拽调整位置                     | 【  】-组件-清空                | 【  】-表达式配置               | 【  】-样式变量支持   | 【  】-支手写自定义方法：执行生命周期规则 |                     | 【  】-完画布与代码实时交互 |
| 【X】-拖拽实时预览                                          | 【  】-主域组件分类标记         |                               | 【  】-手写样式支持   |                                    |                     |                      |
| 【X】-组件: 复制、删除、清空子组件                          | 【X】-拖拽-同级排序          |                               | 【X】-样式实时预览 |                                    |                     |                      |
| 【X】-拖拽:实时预览、实时排序、自由嵌套、属性节点区分       | 【X】-拖拽-跨组件排序        |                               |                     |                                    |                     |                      |
| 【X】-模板：生成、添加、模板截图                            | 【X】-画板协同-选中实时协同  |                               |                     |                                    |                     |                      |
| 【X】-快速预览                                              | 【X】-画板协同-hover实时协同 |                               |                     |                                    |                     |                      |
| 【X】-撤销、重做                                            |                               |                               |                     |                                    |                     |                      |
| 【  】-样式可视化操作：实时预览                                |                               |                               |                     |                                    |                     |                      |
| 【  】-属性可视化操作                                          |                               |                               |                     |                                    |                     |                      |
| 【  】-自定义组件：组件协议自动生成                            |                               |                               |                     |                                    |                     |                      |
| 【X】-父子组件约束限制：红色-禁止添加、黄色-提示可添加、绿色-可添加 |                               |                               |                     |                                    |                     |                      |
| 【X】-组件对象(vDom)扩展                                    |                               |                               |                     |                                    |                     |                      |
| 【X】-自定义reducer处理页面状态                             |                               |                               |                     |                                    |                     |                      |
| 【X】-组件渲染：逻辑渲染、Map渲染、方法渲染                 |                               |                               |                     |                                    |                     |                      |
| 【X】-数据：状态域、变量                                    |                               |                               |                     |                                    |                     |                      |
| 【  】-逻辑：自定义方法、数据映射、变量过滤器                  |                               |                               |                     |                                    |                     |                      |
| 【X】-平台支持:PC各型号手机                                 |                               |                               |                     |                                    |                     |                      |
| 【  】-声明周期：初始化执行、每次渲染执行                      |                               |                               |                     |                                    |                     |                      |
| 【  】-dsl: dsl插件支持                                        |                               |                               |                     |                                    |                     |                      |
| 【  】-plugin：插件扩展                                        |                               |                               |                     |                                    |                     |                      |
| 【  】-标尺展示                                                |                               |                               |                     |                                    |                     |                      |
| 【  】-组件：样式就近操作                                      |                               |                               |                     |                                    |                     |                      |
| 【X】-React                                                 |                               |                               |                     |                                    |                     |                      |
| 【  】-Rax                                                     |                               |                               |                     |                                    |                     |                      |


### 技术交流 QQ群

 <img src="https://user-images.githubusercontent.com/15995127/112433279-fb821700-8d7c-11eb-9b86-da2b0f317b1f.jpeg" width="140" />

### 捐赠作者

如果你觉得这个项目对你有用或者有所启发，可以请作者喝杯咖啡提提神持续更新：

| 微信捐赠  | 支付宝捐赠
|---|---|
| <img src="https://user-images.githubusercontent.com/15995127/111981180-4bc16500-8b42-11eb-8376-60c16e415a8f.png" width="140" />| <img src="https://user-images.githubusercontent.com/15995127/111981247-61368f00-8b42-11eb-82f1-dbe47ca64682.jpeg" width="140" />

## LICENSE

MIT
