import React, { useState } from 'react'
import SettingsPanel from './settingsPanel'
import styles from './index.less'
import AllComponents from './ComponentsPreview'
import ToolBar from './toolBar'
import { message, Radio } from 'antd'
import { Resizable } from 're-resizable'
import 'antd/dist/antd.css'
import 'animate.css/animate.min.css'
import { BrickDesign, BrickProvider } from '@brickd/react'
import PreviewPanel from './PreviewPanel'
import config from './configs'
import initData from './xiaomi'

const COMMON_ENABLE = {
	top: false,
	right: false,
	bottom: false,
	left: false,
	topRight: false,
	bottomRight: false,
	bottomLeft: false,
	topLeft: false,
}
const LEFT_ENABLE = {
	...COMMON_ENABLE,
	right: true,
}

const RIGHT_ENABLE = {
	...COMMON_ENABLE,
	left: true,
}


export default function App() {
	const [isPreview,setIsPreview]=useState(false)
	return (
		<BrickProvider
									 config={config}
									 warn={(msg: string) => {
										 message.warning(msg)
									 }}
		>
			<div className={styles['wrapper']}>
				<ToolBar />
				<div className={styles['content']}>
					<Resizable
						enable={LEFT_ENABLE}
						defaultSize={{ width: '150px', height: '100%' }}
						className={styles['left-preview']}
					>
						<AllComponents />
					</Resizable>

					<div className={styles['canvas-container']}>
						{/*<Radio.Group defaultValue={'0'} style={{marginBottom:20}}*/}
						{/*						 onChange={(e)=>setIsPreview(e.target.value==='1')}>*/}
						{/*	<Radio.Button value={'0'}>*/}
						{/*		编辑*/}
						{/*	</Radio.Button>*/}
						{/*	<Radio.Button value='1'>*/}
						{/*		预览*/}
						{/*	</Radio.Button>*/}
						{/*</Radio.Group>*/}
						{/*{isPreview?<PreviewPanel/>:			<BrickDesign pageName={'test'} initState={{ pageConfig: initData }} />*/}
						{/*}*/}
						<BrickDesign pageName={'test'} initState={{ pageConfig: initData }} />
					</div>
					<Resizable
						enable={RIGHT_ENABLE}
						defaultSize={{ width: '150px', height: '100%' }}
						className={styles['props-shadow']}
					>
						<SettingsPanel />
					</Resizable>
				</div>
			</div>
		</BrickProvider>
	)
}
