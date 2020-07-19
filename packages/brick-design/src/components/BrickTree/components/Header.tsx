import React,{memo} from 'react'
import { handleSelectedStatus,  onMouseOver } from '../../../common/events'
import { LayoutIcon, RowIcon, TriangleIcon } from './Icons'
import styles from '../index.less'
import { SelectedInfoBaseType, useSelector } from 'brickd-core'
import {isEqualKey} from '../../../utils'
const selectedColor = '#5E96FF'
const unSelectedColor = '#555555'
const selectedBGColor = '#F2F2F2'
const hoveredBGColor = '#F1F1F1'

interface HeaderProps {
	specialProps:SelectedInfoBaseType,
	propName?:string,
	setIsUnfold:any,
	isUnfold:boolean,
	componentName:string,
	hasChildNodes:boolean
}

function controlUpdate(prevState,nextState,key:string) {
	return true
}

function Header(props:HeaderProps) {
	const { specialProps,propName,specialProps:{key},setIsUnfold,isUnfold,componentName,hasChildNodes } = props
	const {selectedInfo,hoverKey}=useSelector(['selectedInfo', 'hoverKey'],
		(prevState,nextState)=>controlUpdate(prevState,nextState,key))
	const {propName:selectedPropName,selectedKey}=selectedInfo||{}
	const sortItemKey=propName?`${key}${propName}`:key
	const isSelected=isEqualKey(sortItemKey,selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey)
	const isHovered=isEqualKey(sortItemKey,hoverKey)
	const color = isSelected ? selectedColor : unSelectedColor

	return (
		<div
			style={{ backgroundColor: isSelected && selectedBGColor || isHovered && hoveredBGColor || '#0000' }}
			className={styles['header-container']}
		>
			<div onClick={() => handleSelectedStatus(null, isSelected, specialProps, propName)}
					 onMouseOver={(e: any) => onMouseOver(e, sortItemKey, isSelected)}
					 style={{ display: 'flex', flex: 1, alignItems: 'center', color }}>
				<TriangleIcon
					className={`${styles.triangle} ${isUnfold &&styles.rotate90}`}
					style={{
						visibility: hasChildNodes ? 'visible' : 'hidden',
					}}
					onClick={(event) => {
						event.stopPropagation()
						setIsUnfold(!isUnfold)
					}
					}
				/>
				{componentName.includes('Layout')?<LayoutIcon style={{color,marginRight:5}} />:<RowIcon style={{color,marginRight:5}}/>}
				<span>{componentName}</span>
			</div>

		</div>
	)
}
export default memo(Header)
