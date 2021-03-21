import React from 'react'
import styles from './index.less'
import { BrickDesign, useSelector } from '@brickd/react'
import initData from '@/xiaomi'

export default function DesignPanel() {
	const { platformInfo } = useSelector(['platformInfo'])
	const { size } = platformInfo

	const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' }

	return (
		<div
			style={style}
			className={`${styles['browser-mockup']} ${styles['with-url']}`}
		>
			<BrickDesign pageName={'test'} initState={{ pageConfig: initData }} />
		</div>
	)
}
