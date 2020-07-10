import React, { memo, useEffect, useState } from 'react'
import { isEmpty, map, isArray, isEqual } from 'lodash'
import SortTree from './SortTree'
import styles from './index.less'
import { usePrevious } from '../../utils'
import {
	ChildNodesType,
	clearDropTarget,
	ComponentConfigsType,
	getComponentConfig,
	isContainer,
	NodeProps,
	NodePropsConfigType,
	PropsNodeType,
	SelectedInfoBaseType,
	SelectedInfoType,
	STATE_PROPS,
	useSelector,
} from 'brickd-core'
import { getDropTargetInfo, handleSelectedStatus, onMouseOver, selectedStatus } from '../../common/events'
import Collapse, { Panel } from 'rc-collapse'

import {LayoutIcon,TriangleIcon,RowIcon} from './Icons'


function controlUpdate(prevState: HookState, nextState: HookState, key: string) {

	if (prevState.componentConfigs[key] === nextState.componentConfigs[key]) {
		const { selectedKey: prevSelectedKey, propName: prevPropName } = prevState.selectedInfo || {}
		const { selectedKey, propName } = nextState.selectedInfo || {}
		return prevSelectedKey == key &&
			(selectedKey !== key || selectedKey === key && prevPropName !== propName) ||
			prevSelectedKey !== key && selectedKey === key ||
			prevState.hoverKey === key && nextState.hoverKey !== key ||
			prevState.hoverKey !== key && nextState.hoverKey === key


	}
	return true
}


interface SortItemPropsType {
	isFold?: boolean,
	propChildNodes?: string[],
	specialProps: SelectedInfoBaseType,
	propName?: string,
	nodeProps?: NodeProps
}

// const handleMenuClick = (e: any) => {
// 	switch (e.key) {
// 		case '1':
// 			return clearChildNodes()
// 		case '2':
// 		case '3':
// 			return copyComponent()
// 		case '4':
// 			return deleteComponent()
// 	}
// }

// function renderMenu(domKey: string, isOnlyNode?: boolean, isClear?: boolean) {
// 	const isRoot = domKey === ROOT
// 	return (
// 		<Menu onClick={handleMenuClick}>
// 			{isClear && <Item key={1}>清除</Item>}
// 			{!isRoot && !isOnlyNode && <Item key={3}>复制</Item>}
// 			{!isRoot && <Item key={4}>删除</Item>}
// 		</Menu>)
// }

/**
 * 渲染页面结构节点
 * @returns {*}
 */
function renderHeader(isUnfold: boolean,
											props: SortItemPropsType,
											isSelected: boolean,
											isHovered: boolean,
											setIsUnfold: any,
											componentName: string,
											childNodes?: ChildNodesType,
											nodePropsConfig?: NodePropsConfigType,
) {
	const { specialProps, specialProps: { key } } = props
	const selectedColor = '#5E96FF'
	const unSelectedColor = '#555555'
	const selectedBGColor = '#F2F2F2'
	const hoveredBGColor = '#F1F1F1'
	const color = isSelected ? selectedColor : unSelectedColor
	let propName = props.propName
	let isNodePropsRoot = false

	if (nodePropsConfig && !propName) {
		propName = Object.keys(nodePropsConfig)[0]
		isNodePropsRoot = true
	}
	return (
		<div
			style={{ backgroundColor: isSelected ? selectedBGColor : isHovered ? hoveredBGColor : '#0000' }}
			className={styles['header-container']}
		>
			<div onClick={() => handleSelectedStatus(null, isSelected, specialProps, propName)}
					 onMouseOver={(e: any) => onMouseOver(e, isNodePropsRoot || propName ? `${key}${propName}` : key, isSelected)}
					 style={{ display: 'flex', flex: 1, alignItems: 'center', color }}>
				<TriangleIcon
					className={isUnfold &&styles.rotate90}
					style={{
						padding: 3,
						width:22,
						height:22,
						transition: 'all 0.2s',
						cursor:'pointer',
						visibility: isNodePropsRoot || !isEmpty(childNodes) ? 'visible' : 'hidden',
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
			{/*{*/}
			{/*	isSelected &&*/}
			{/*	<Dropdown*/}
			{/*		trigger={['click']}*/}
			{/*		overlay={renderMenu(key)}*/}
			{/*	>*/}
			{/*		<Icon component={getIcon('more')} style={{ color }}/>*/}
			{/*	</Dropdown>*/}
			{/*}*/}
		</div>
	)
}

/**
 * 渲染子组件或者属性节点
 * @returns {Array|*}
 */
function renderSortTree(props: SortItemPropsType, isUnfold: boolean, componentName: string, nodePropsConfig?: NodePropsConfigType, childNodes?: ChildNodesType) {
	const {
		specialProps,
		propName,
		nodeProps,
	} = props
	if (childNodes && isArray(childNodes) || !childNodes && !nodePropsConfig) {
		return (<SortTree
			isFold={!isUnfold}
			childNodes={childNodes && (childNodes as string[]) || []}
			propName={propName}
			specialProps={specialProps}
			nodeProps={nodeProps}
			componentName={componentName}
		/>)
	}

	/**
	 * 处理属性节点子组件
	 */
	return map(nodePropsConfig, (nodeProps, propName) => {
		// const propKey = `${key}${propName}`;
		const propChildNodes = childNodes && (childNodes as PropsNodeType)[propName] || []
		return <SortItem
			{...props}
			propChildNodes={propChildNodes}
			specialProps={specialProps}
			propName={propName}
			key={propName}
			nodeProps={nodeProps}
		/>
	})

}


export type HookState = {
	selectedInfo: SelectedInfoType,
	hoverKey: string,
	componentConfigs: ComponentConfigsType
}

export const stateSelector: STATE_PROPS[] = ['selectedInfo', 'hoverKey', 'componentConfigs']

function SortItem(props: SortItemPropsType) {
	const {
		specialProps: { key, parentPropName, parentKey, domTreeKeys },
		isFold,
		propName,
		propChildNodes,
	} = props

	const { selectedInfo, hoverKey, componentConfigs } = useSelector(stateSelector,
		(prevState, nextState) => controlUpdate(prevState, nextState, key))
	const { selectedKey, domTreeKeys: nextSDTKeys, propName: selectedPropName } = selectedInfo || {}
	const { isHovered, isSelected } = selectedStatus(propName ? `${key}${propName}` : key, hoverKey,
		selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey)
	const vDom = componentConfigs[key]
	const { childNodes: vDomChildNodes, componentName } = vDom || {}
	const { fatherNodesRule, nodePropsConfig } = getComponentConfig(componentName)
	const childNodes: ChildNodesType | undefined = propChildNodes || vDomChildNodes
	const [isUnfold, setIsUnfold] = useState(!isEmpty(childNodes))
	// 保存子组件dom
	const prevChildNodes = usePrevious<ChildNodesType>(childNodes)

	const prevSDTKeys = usePrevious(nextSDTKeys)

	//新添加组件展开
	useEffect(() => {
		if (!isUnfold && !isEqual(prevChildNodes, childNodes)) {
			setIsUnfold(true)
		}
	}, [prevChildNodes, childNodes, isUnfold])


	// 父节点折叠当前节点是展开的就折叠当前节点
	useEffect(() => {
		if (isFold && isUnfold) setIsUnfold(false)
	}, [isFold, isUnfold])

	if (!componentName) return null
	if (!isEqual(prevSDTKeys, nextSDTKeys) && nextSDTKeys && !isUnfold && nextSDTKeys.includes(key)) {
		setIsUnfold(true)
	}

	const isContainerComponent = isContainer(componentName)

	return (
		<div
			className={styles['sort-item']}
			id={key}
			data-special={JSON.stringify({ key, parentPropName, parentKey })}
			data-farules={fatherNodesRule && JSON.stringify(fatherNodesRule)}
			data-name={componentName}
			onDragEnter={(e: any) => {
				//如果目标组件为非容器组件就重置目标容器信息
				if (!isContainerComponent) return clearDropTarget()
				let propNameResult = propName
				//如果当前目标是多属性节点容器，获取容器的最后一属性节点作为目标容器
				if (!propNameResult && nodePropsConfig) {
					propNameResult = Object.keys(nodePropsConfig).pop()
				}
				getDropTargetInfo(e, domTreeKeys, key, propNameResult)
			}}
		>
			{renderHeader(isUnfold, props, isSelected, isHovered, setIsUnfold, propName || componentName, childNodes, nodePropsConfig)}

			{isContainerComponent && <Collapse
				activeKey={isUnfold ? '1' : '2'}
				style={{ marginLeft: 24 }}
			>
				<Panel showArrow={false} key='1'  style={{ border: 0, backgroundColor: '#fff' }}>
					{renderSortTree(props, isUnfold, componentName, nodePropsConfig, childNodes)}
				</Panel>
			</Collapse>}
		</div>
	)
}


export default memo<SortItemPropsType>(SortItem)
