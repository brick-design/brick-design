# brick-design

> 拖拽画板
###  📦 Install
```sh
yarn add brickd brickd-core bricks-web
```

```bash
npm install brickd brickd-core bricks-web
```
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

