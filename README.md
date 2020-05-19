<h1 align='center'>react-visual-editor</h1>

### 新版地址：[Brick Design](https://github.com/anye931123/react-visual-editor/tree/brickd)
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
![mobile](docs/mobile.png)

![PC](docs/pc.png)

![Code](docs/Code.png)

## Usage

```sh
// 下载项目单独运行
git clone https://github.com/anye931123/react-visual-editor.git
npm install 
npm run dev

// umi项目可通过添加block方式添加此项目
umi block add https://github.com/anye931123/react-visual-editor
```
## 目录结构
```
- src
  |- components  //项目依赖的组件
  |- configs   //全局配置信息
     |- componentConfgs  //组件配置信息包括react和html的组件信息
        |- Ant         //Antd组件配置信息
        |- customComponents  //自定组件配置信息
        |- HTML        //html标签配置信息
        |- index.ts           //所有配置信息汇总导出供config使用
     |- htmlCategory.ts   //html组件分类
     |- index.ts    // 配置信息汇总
     |- reactCategory.ts   //react组件分类组件分类
  |- customComponents  //自定义组件存放位置
  |- locales   //国际化
  |- models    //dva model位置，所有功能逻辑存放处
  |- modules  //功能模块
     |- componentsPreview  //组件预览模块（容器组件，非容器组件，模板）
     |- designPanel  //设计面板（画板）模块
     |- previewAndCode  //页面预览与代码预览模块
     |- settingsPanel   //设置面板模块
        |- components  //设置面板子模块通用组件
        |- domTree    //domTree（组件树）模块
        |- propsSettings  //属性配置子模块
        |- styleSettings  //样式配置子模块
     |- toolBar   //工具栏模块
  |- service     //后台接口存放区域
  |- types       //全局数据定义
  |- utils  
```
### types
- CategoryType 组件分类数据结构定义 具体信息已在代码中注释
- ComponentConfigType  组件信息属性结构定义 具体信息已在代码中注释
- ConfigTypes   全局配置信息数据结构定义 具体信息已在代码中注释
- ModelType   model数据结构定义

### configs
通过配置config可以实现拖拽组件库的替换，更改为你需要的组件库或者组件。具体配置如下
- OriginalComponents 所有的需要拖拽的原始组件汇总
- AllComponentConfigs 所有的组件配置信息
- CONTAINER_CATEGORY 容器组件分类
- NON_CONTAINER_CATEGORY 非容器组件分类
- iframeSrcDoc 设计面板iframe模板
### 技术交流
| QQ群 |
| --- |
| <img src="./docs/QQ.jpeg" width="100" />

## LICENSE

MIT
