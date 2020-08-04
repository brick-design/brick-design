import React, { useState } from 'react'
import SettingsPanel from './settingsPanel'
import styles from './index.less'
import AllComponents from './ComponentsPreview'
import ToolBar from './toolBar'
import {Radio} from 'antd'
import { Resizable } from 're-resizable'
import 'antd/dist/antd.css'
import 'animate.css/animate.min.css'
import { BrickProvider } from '@brickd/react'
import DesignPanel from './DesignPanel'
import PreviewPanel from './PreviewPanel'
import config from './configs'
import initData from './initData'

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

/**
 *
 */
export default function App() {
	const [isPreview,setIsPreview]=useState(false)
	return (
		<BrickProvider initState={{ componentConfigs: initData }} config={config}>
			<div className={styles['wrapper']}>
				<ToolBar />
				<div className={styles['content']}>
					<Resizable
						enable={LEFT_ENABLE}
						defaultSize={{ width: '260px', height: '100%' }}
						className={styles['left-preview']}
					>
						<AllComponents />
					</Resizable>

					<div className={styles['canvas-container']}>
						<Radio.Group defaultValue={'0'} style={{marginBottom:20}}
												 onChange={(e)=>setIsPreview(e.target.value==='1')}>
							<Radio.Button value={'0'}>
								编辑
							</Radio.Button>
							<Radio.Button value='1'>
								预览
							</Radio.Button>
						</Radio.Group>
						{isPreview?<PreviewPanel/>:<DesignPanel />}

					</div>
					<Resizable
						enable={RIGHT_ENABLE}
						defaultSize={{ width: '300px', height: '100%' }}
						className={styles['props-shadow']}
					>
						<SettingsPanel />
					</Resizable>
				</div>
			</div>
		</BrickProvider>
	)
}
