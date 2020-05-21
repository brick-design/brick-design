# bricks-web

> 功能组件集 web版
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
import {BrickDesign} from 'brickd';
import {BrickTree,BrickPreview} from 'bricks-web'

const App = () => (
  <LegoProvider config={{...}}>
<div>
    <BrickPreview componentsCategory={...} searchValues={...} isShow={true}/>
    <BrickDesign />
<BrickTree/>
</div>
  </LegoProvider>

);
```
And import style manually:

```jsx
import 'bricks-web/dist/index.css';
import 'brickd/dist/index.css';
```
