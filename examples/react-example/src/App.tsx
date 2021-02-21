import React, { useState } from 'react'
import SettingsPanel from './settingsPanel'
import styles from './index.less'
import AllComponents from './ComponentsPreview'
import ToolBar from './toolBar'
import { message, Radio } from 'antd'
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

const images=[
'https://t7.baidu.com/it/u=3435942975,1552946865&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1415984692,3889465312&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=4080826490,615918710&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=334080491,3307726294&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=3713375227,571533122&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=2235903830,1856743055&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=801209673,1770377204&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1635608122,693552335&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=774679999,2679830962&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1856946436,1599379154&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1010739515,2488150950&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=1314925964,1262561676&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=813347183,2158335217&fm=193&f=GIF',
	'https://t7.baidu.com/it/u=3694360626,2933607547&fm=193&f=GIF'

]
/**
 * mock 数据
 */
const listData:any[] = [];
for (let i = 0; i < 23; i++) {
	listData.push({
		href: 'http://ant.design',
		title: `ant design part ${i}`,
		avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
		image:images[i]||images[1],
		description:
			'Ant Design, a design language for background applications, is refined by Ant UED Team.',
		content:
			'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
	});
}

export default function App() {
	const [isPreview,setIsPreview]=useState(false)
	return (
		<BrickProvider initState={{ pageConfig: initData,pageState:{state:{v:false,n:0,items:listData}} }}
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
