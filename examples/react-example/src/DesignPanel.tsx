import React from 'react'
import styles from './index.less'
import { BrickDesign, useSelector } from '@brickd/react'
import initData from '@/initData'

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
export default function DesignPanel() {
	const { platformInfo } = useSelector(['platformInfo'])
	const { size } = platformInfo

	const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' }

	return (
		<div
			style={style}
			className={`${styles['browser-mockup']} ${styles['with-url']}`}
		>
			<BrickDesign pageName={'test'} initState={{ pageConfig: initData,pageStateConfig:{state:{v:false,n:0,items:listData}} }} />
		</div>
	)
}
