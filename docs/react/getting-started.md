---
title: 快速上手
order: 9
nav:
  order: 10
---
### 安装组件

```bash
yarn add @brickd/react
```
OR
```bash
npm install @brickd/react
```
## 在项目中使用
```jsx | pure
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,useSelector,createActions} from '@brickd/react';
const plugins=[(vDom,componentConfig)=>vDom];
const customReducer=(state,action)=>{
const {type,payload}=action
switch (type){
case 'customReducer':
return {...state}
default:
return state
}

}
const App = () => {
const {componentConfigs}=useSelector(['componentConfigs'])

	return(<BrickProvider initState={{}} customReducer={customReducer} config={{...}}>
<div onClick={()=>createActions({type:"customReducer",payload:{...}})}> 出发action</div>
    <BrickDesign />
<BrickTree/>

  </BrickProvider>);
}
```
