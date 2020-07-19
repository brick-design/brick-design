# brickd-core

> TODO: description
## Usage
```jsx
import { LegoProvider } from 'brickd-core';
import {BrickDesign,BrickTree} from 'brickd';
import {BrickPreview} from 'bricks-web'


const App = () => (
  <LegoProvider config={{...}}>
<div>
    <BrickPreview componentsCategory={...}/>
    <BrickDesign />
<BrickTree/>
</div>
  </LegoProvider>

);
```

