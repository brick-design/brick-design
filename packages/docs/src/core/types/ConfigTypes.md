### ConfigType
> 类型：object
>
>描述：全局组件注册配置

#### 属性
|属性名|类型|描述|
|---|---|---|
|OriginalComponents|[OriginalComponentsType](/#OriginalComponentsType)|原始组件集|
|CONTAINER_CATEGORY|[CategoryType](./CategoryType.md)|容器组件分类|
|NON_CONTAINER_CATEGORY|[CategoryType](./CategoryType.md)|非容器组件分类|
|AllComponentConfigs|[CategoryType](./CategoryType.md)|所有的组件配置集|

###  OriginalComponentsType
> 类型：object
>
>描述：原始组件集

#### 定义
```
interface OriginalComponentsType{
  [componentName:string]:ReactNode
}
```


### PROPS_TYPES
> 类型：enum
>
>描述：属性值类型定义

#### 定义
```ts
export enum PROPS_TYPES {
  object = 'object',  // {...}
  objectArray = 'objectArray', //[{...},{...}]
  function = 'function',  // '方法名'
  number = 'number',  // 1
  numberArray = 'numberArray',  // [1,2,3]
  string = 'string', // '字符串'
  stringArray = 'stringArray',  // ['','']
  enum = 'enum',  // 属性可选择值固定某些值：例如 small，normal，big
  json = 'json',  // json字符串
  boolean = 'boolean',  //true/false
  reactNode = 'reactNode',  // 属性节点专用
  functionReactNode = 'functionReactNode',  //属性节点方法返回组件专用
}
```

