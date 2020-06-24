## LegoProvider
这是核心库中唯一的组件，其为后代组件提供配置信息初始化，以及State透传。

### 属性
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|config|[ConfigType](#ConfigType)|全局配置信息|是|
|initState|[State](#Conifg)|默认页面配置信息|否|

#### ConfigType
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|OriginalComponents|[OriginalComponentsType](#OriginalComponentsType)|需要拖拽支持的所有组件集合|是|
|AllComponentConfigs|[AllComponentConfigsType](#AllComponentConfigsType)|所有组件的配置信息与OriginalComponents组件集合一一对应|是|
|containers|string[]|容器组件集合帮助工具识别哪些组件是容器组件使他们可以实现拖拽嵌套等容器功能|是|
|warn|function(msg: string)|警告回调函数|否|
#### OriginalComponentsType
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|componentName|ReactNode|组件|是|
#### AllComponentConfigsType
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|componentName|[ComponentConfigTypes](#ComponentConfigTypes)|组件配置信息|是|
#### ComponentConfigTypes
|属性名|属性值类型|属性描述|是否必填|备注|
|---|---|---|---|---|
|fatherNodesRule|string[]|父组件约束，限定组件的父组件|否|只有容器组件且只有children子组件有效，优先级低于nodePropsConfig|
|childNodesRule|string[]|子组件约束，限定组件的子组件|否|只有容器组件且只有children子组件有效，优先级低于nodePropsConfig|
|isRequired|boolean|组件是否必须有子组件|否|只有容器组件且只有children子组件有效，优先级低于nodePropsConfig|
|isOnlyNode|boolean|组件的子组件是否必须为单一节点|否|只有容器组件且只有children子组件有效，优先级低于nodePropsConfig|
|nodePropsConfig|[NodePropsConfigType](#NodePropsConfigType)|多属性节点配置信息|否|只有组件的属性节点不只一个或者属性名不是children时需要配置此属性|
|mirrorModalField|[MirrorModalFieldType](#MirrorModalFieldType)|弹窗类组件相关配置|否|此属性只适用于弹窗类组件|
|propsConfig|[PropsConfigType](#PropsConfigType)|属性配置信息|是|-|
#### NodePropsConfigType
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|propName|[NodeProps](#NodeProps)|属性节点对应的属性相关配置信息|是|
#### NodeProps
|属性名|属性值类型|属性描述|是否必填|
|---|---|---|---|
|type|`reactNode'\|'functionReactNode'|属性节点对应的属性相关配置信息|是|
