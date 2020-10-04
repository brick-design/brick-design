---
title: 功能方法
order: 9
nav:
  order: 10
---

### createTemplate(state)
生成模板，当在页面编辑区选中任意个组件，执行这个方法会就会生成模板，模板也可以叫模板组件，可以像组件一样拖拽添加。
返回值为对象包含模板配置信息以及自定义模板属性配置信息。

返回值属性如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| templateConfigs | object | 模板配置信息 |
| templatePropsConfigSheet | object | 模板属性配置信息|

### addComponent()
当拖拽组件往页面编辑区域拖放并放下触发，将新组件添加大页面配置中，如果没有拖拽目标，该方法不会做任何处理。
### copyComponent() 
复制组件，前提是需要先选中一个组件，如果没有选中组件，该方法不会做任何处理。
### onLayoutSortChange({sortKeys,parentKey,parentPropName?，dragInfo?})
调整组件顺序，这个方法是BrickTree组件触发的参数信息如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| sortKeys | string[] | 排序后的组件key集合 |
| parentKey | string | 放置位置的父组件key |
| parentPropName | string| 放置所属父组件属性，如果不传默认为children |
| dragInfo | [DragInfoType](#DragInfoType) | 当brickTree节点跨容器拖拽排序时需要携带拖拽组件的信息|

##### DragInfoType
| 属性   | 类型   | 描述         |是否必填|
| ----- | ------ | ------------ |------------ |
| key | string | 被拖拽组件的key |Y|
| parentKey | string | 被拖拽组件的原父组件key |Y|
| parentPropName | string| 被拖拽组件所属的原父组件属性，如果不传默认为children |N|

### deleteComponent()
删除选中组件，前提是需要先选中一个组件，如果没有选中组件，该方法不会做任何处理。
### clearChildNodes()
清除容器组件指定属性的所有子节点，如果没有选中指定的属性，将清除容器组件的所有属性节点，前提是需要先选中一个组件，如果没有选中组件，该方法不会做任何处理。

### getDragSource({componentName,defaultProps?})
获取拖拽源信息，即拖拽组件信心，当页面需要拖拽新添加组件时执行该方法，该方法应该在拖拽组件onDragStart方法中执行，方法会将拖拽的组件信息存入redux state中，
用以供后续[addComponent](#addcomponent) 方法执行添加工作。
参数列表如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| componentName | string| 组件名 |
| defaultProps | object | 组件默认属性对象 |

### getDragTemplate({vDOMCollection,propsConfigCollection})
获取拖拽模板信息，当页面需要拖拽新添加模板时执行该方法，该方法应该在代表拖拽模板的组件onDragStart方法中执行，方法会将拖拽的组件信息存入redux state中，
用以供后续[addComponent](#addcomponent) 方法执行添加工作。
参数列表如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| vDOMCollection | [ComponentConfigsType](#componentconfigstype)| 模板配置信息 |
| propsConfigCollection | [PropsConfigSheetType](#propsconfigsheettype) | 模板属性配置信息|
### getDragComponent({dragKey,parentKey,parentPropName?})

获取编辑区域拖拽组件信息，当在页面编辑区域需要更改组件位置等时执行该方法，该方法应该在组件的onDragStart方法中执行，方法会将拖拽的组件信息存入redux state中，
用以供后续[addComponent](#addcomponent) 方法执行添加工作。
参数列表如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| dragKey | string| 拖拽组件的key |
| parentKey | string | 拖拽组件所属父组件的key|
| parentPropName | string | 拖拽组件所属父组件的属性名|

### getDropTarget({selectedKey,propName?,domTreeKeys})
获取放置组件的信息，当拖拽组件想要放入某个容器组件时，就在这个容器组件上方松开鼠标，该方法应该在容器组件的onDragEnter方法中执行，方法会将放置目标容器组件信息存入redux state中，
用以供后续[addComponent](#addcomponent) 方法执行添加工作。
参数列表如下

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| selectedKey | string| 放置容器组件的key |
| propName | string | 放置容器组件的属性，如果没有默认会放置到children|
| domTreeKeys | string[] | 放置组件在页面组件树的组件链，包含组件链中所有组件的key，用于在组件树中定位展示|

### clearDropTarget()
清除放置组件容器在state树中的信息，以防止在其他功能方法执行时导致错误。
### clearDragSource()
清除拖拽组件在state树中的信息，以防止在其他功能方法执行时导致错误。

### clearHovered()
清除组件的hover状态。

### overTarget({hoverKey})
获取hover组件的key，主要目的为BrickDesign组件与BrickTree组件相互映射实现同步交互。
### addPropsConfig({newPropField?,fatherFieldLocation,childPropsConfig?,propType?})
添加自定义组件配置信息，如果属性配置模块展示的组件不全时，或属性值为自定义对象时，执行该方法。参数列表

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| newPropField | string| 新添加字段的名 |
| fatherFieldLocation | string | 所要添加字段父属性位置|
| childPropsConfig | [PropsConfigType]()[] | 如果添加的是对象数组，那么属性配置信息也是数组形式|
| propType | [PROPS_TYPES]() |新添加字段的类型|

### deletePropsConfig({fatherFieldLocation,field})
删除组件属性配置，当某个组件的属性配置不想要使，可以删除这个属性的配置信息

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| field | string| 要删除属性的属性名 |
| fatherFieldLocation | string | 要删除属性的所属对象的位置|

### changeProps({props})
当属性配置面板配置属性时，所有属性的结果值会收集起来，传给相应的组件。

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| props | object| 组件的属性集合 |

### resetProps()
当选中组件时，会将组件选中时的组件属性保存下来，如果组件的属性更改后，想要还原到组件选中前的属性状态，就可以执行此方法，

### undo()
回退方法，brick design会将你的所有操作保存起来，如果你后悔了某一步操作可以回退到这一步。
### redo()
重做方法，brick design会将你的所有回退操作保存起来，如果你多回退了某一步操作可以重新回到这一步。

### selectComponent({key,domTreeKeys,propName?})
选中组件操作，当你在页面编辑区域或者在组件树的中选中某个节点，这时就触发此方法，将选中的组件或节点信息保存到redux state中，供以后的其他
操作使用，参数入参

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| key | string| 选中组件的key |
| domTreeKeys | string[]| 选中组件所在组件树中的组件链，包含了所在链的所有组件key |
| propName | string| 如果选中组件为多属性节点组件就会选中其中一个属性名 |

### clearSelectedStatus()
清除选中组件的选中状态。
### changeStyles({style})
更改组件的样式，当样式配置面板更改样式值时，会同步触发此方法，改方法会将更改后的样式存入选中组件的属性上，并实时渲染展示样式效果，执行该功能前提是先选中组件，
如果没有选中组件，不会做任何处理。

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| style | object| 变更后的样式对象 |


### resetStyles()
当选中组件时，会将组件选中时的组件样式保存下来，如果组件样式更改后，想要还原到组件选中前的样式效果，就可以执行此方法，


### resizeChange({width?,height?})
拖拽更组件宽高，当选中一个标准组件时，会在组件选中变宽与四角展示一个小圆点，鼠标放到这些点点可以拖拽更改组件的宽高。

| 属性   | 类型   | 描述         |
| ----- | ------ | ------------ |
| width | string| 拖拽变更组件的宽 |
| height | string| 拖拽变更组件的高 |






