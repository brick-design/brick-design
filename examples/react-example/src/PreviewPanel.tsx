import React,{createElement} from 'react'
import styles from './index.less'
import { useSelector } from '@brickd/react'
import brickRender from '@brickd/render'

export default function PreviewPanel() {
	const { platformInfo,componentConfigs } = useSelector(['platformInfo','componentConfigs'])
	const { size } = platformInfo

	const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' }

	return (
		<div
			style={style}
			className={`${styles['browser-mockup']} ${styles['with-url']}`}
		>
			{brickRender(componentConfigs,createElement)}
		</div>
	)
}
