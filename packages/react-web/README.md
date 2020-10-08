# @brickd/react-web

> 功能组件集 web 版

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
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,useSelector,createActions} from '@brickd/react';
import {BrickPreview} from '@brickd/react-web';
import BrickRender from '@brickd/render';
const plugins=[(vDom,componentSchema)=>vDom];
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
const {pageConfig}=useSelector(['pageConfig'])

	return(<BrickProvider initState={{}} customReducer={customReducer} config={{...}}>
<div onClick={()=>createActions({type:"customReducer",payload:{...}})}> 出发action</div>

    <BrickPreview/>
    <BrickDesign />
<BrickRender pageConfig={pageConfig} createElement={createElement} plugins={plugins}/>
<BrickTree/>

  </BrickProvider>);
}
```
```
