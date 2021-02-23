import React from 'react'
import styles from './index.less'
import { useSelector } from '@brickd/react'
import {BrickRender} from '@brickd/render'
import config from './configs'

export default function PreviewPanel() {
	const { platformInfo,pageConfig,pageStateConfig } = useSelector(['platformInfo','pageConfig','pageStateConfig'])
	const { size } = platformInfo
	console.log('pageConfig>>>>>>',pageConfig)
	const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' }
	return (
		<div
			style={style}
			className={`${styles['browser-mockup']} ${styles['with-url']}`}
		>
			<BrickRender componentsMap={config.componentsMap} pageConfig={pageConfig} pageStateConfig={pageStateConfig}/>
		</div>
	)
};
