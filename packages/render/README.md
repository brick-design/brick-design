# `@brickd/render`

> TODO: description

## Usage

```
import {createElement} from 'react';
import {BrickDesign,BrickTree,BrickProvider,} from '@brickd/canvas';
import {BrickPreview} from '@brickd/components';
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
