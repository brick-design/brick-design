# brick-design

> 拖拽画板

###  📦 Install
```sh
yarn add @brickd/canvas  @brickd/components @brickd/render
```
OR
```sh
npm install @brickd/canvas @brickd/components @brickd/render
```
## Usage
```jsx
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,useSelector,createActions} from '@brickd/canvas';
import {BrickPreview} from '@brickd/components';
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
