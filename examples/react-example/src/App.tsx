import React from 'react'
import 'antd/dist/antd.css'
import 'animate.css/animate.min.css'
import config, { CONTAINER_CATEGORY } from './configs'
import initData from './xiaomi'
import {  BrickEdifice } from '@brickd/components'


export default function App() {
	return (<BrickEdifice
		componentsCategory={CONTAINER_CATEGORY}
		config={config}
		initBrickdState={{Xiaomi:{pageConfig:initData}}}
			/>)
}
