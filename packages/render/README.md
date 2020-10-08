# `@brickd/render`

> TODO: description

## Usage

```
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,} from '@brickd/react';
import {BrickPreview} from '@brickd/react-web';
import BrickRender from '@brickd/render';
const plugins=[(vDom,componentSchema)=>vDom];
const App = () => (
  <BrickProvider initState={{}} customReducer={(state,action)=>state} config={{...}}>
<div>
    <BrickPreview/>
    <BrickDesign />
<BrickRender />
<BrickTree/>
</div>
  </BrickProvider>

);
```
