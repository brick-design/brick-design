import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dropdown, Icon, Menu } from 'antd'
import styles from '../style.less'
import map from 'lodash/map'
import { PlatformMenusType } from '../config'
import { changePlatform, PlatformInfoType, PlatformSizeType } from '@brickd/canvas'

interface SwitchPlatformPropsType {
	platformInfo?: PlatformInfoType
	menus: PlatformMenusType
}

const MenuItem = Menu.Item

function SwitchPlatform(props: SwitchPlatformPropsType) {
	const { menus } = props
	const [isMobile, setIsMobile] = useState(false)
	const [mobileModel, setMobileModel] = useState(Object.keys(menus)[0])
	const [isVertical, setIsVertical] = useState(true)

	useEffect(() => {
		const size:PlatformSizeType = isMobile ? menus[mobileModel]: [1920, 1080]
		!isVertical && size.reverse()
		changePlatform({
			platformName:isMobile?mobileModel:'PC',
			size,
		})
	}, [isMobile, isVertical, menus, mobileModel])

	const renderMenu = useCallback(() => {
		return (
			<Menu
				selectedKeys={[mobileModel]}
				onClick={({ key }: any) => setMobileModel(key)}
			>
				{map(menus, (_, key) => {
					return <MenuItem key={key}>{key}</MenuItem>
				})}
			</Menu>
		)
	}, [menus, mobileModel])

	const dropProps = isMobile ? {} : { visible: false }
	return (
		<div className={styles['switch-container']}>
			<Dropdown
				overlay={useMemo(() => renderMenu(), [renderMenu])}
				{...dropProps}
				trigger={['hover']}
			>
				<div
					className={styles['switch-platform']}
					onClick={() => setIsMobile(!isMobile)}
				>
					<Icon
						style={{ fontSize: 18 }}
						type={isMobile ? 'android' : 'windows'}
					/>
					<span>{isMobile ? 'mobile' : 'PC'}</span>
				</div>
			</Dropdown>
			{isMobile && (
				<Icon
					onClick={() => setIsVertical(!isVertical)}
					style={{ fontSize: 20 }}
					type={'sync'}
				/>
			)}
		</div>
	)
}

export default SwitchPlatform
