import React, { memo, useEffect, useState } from 'react'
import { isEmpty, map, isArray, isEqual,get } from 'lodash'
import SortTree from './SortTree'
import styles from './index.less'
import { isEqualKey, usePrevious } from '../../utils'
import {
	ChildNodesType,
	clearDropTarget,
	ComponentConfigsType,
	getComponentConfig,
	isContainer,
	NodeProps,
	NodePropsConfigType,
	SelectedInfoBaseType,
	SelectedInfoType,
	STATE_PROPS,
	useSelector,
} from 'brickd-core'
import { getDropTargetInfo} from '../../common/events'
import Collapse, { Panel } from 'rc-collapse'
import Header from './components/Header'

function controlUpdate(prevState: HookState, nextState: HookState, key: string) {

	if (prevState.componentConfigs[key] === nextState.componentConfigs[key]) {
		const { selectedKey: prevSelectedKey, propName: prevPropName } = prevState.selectedInfo || {}
		const { selectedKey, propName } = nextState.selectedInfo || {}
		return prevSelectedKey == key &&
			(selectedKey !== key || selectedKey === key && prevPropName !== propName) ||
			prevSelectedKey !== key && selectedKey === key


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
 * 渲染子组件或者属性节点
 * @returns {Array|*}
 */
function renderSortTree(props: SortItemPropsType, isUnfold: boolean, componentName: string, nodePropsConfig?: NodePropsConfigType, childNodes?: ChildNodesType) {
	const {
		specialProps,
		propName,
		nodeProps,
	} = props

	if (isArray(childNodes) || !childNodes && nodePropsConfig) {
		return (<SortTree
			isFold={!isUnfold}
			childNodes={childNodes?(childNodes as string[]):[]}
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
		return <SortItem
			{...props}
			propChildNodes={get(childNodes,propName,[])}
			specialProps={specialProps}
			propName={propName}
			key={propName}
			nodeProps={nodeProps}
		/>
	})

}

/**
 * 获取组件选中状态
 * @param key
 * @param hoverKey
 * @param selectedKey
 */
export function selectedStatus(key: string, hoverKey: string | null, selectedKey?: string) {
	const isSelected = isEqualKey(key,selectedKey);
	/** 是否hover到当前组件 */
	const isHovered = isEqualKey(key,hoverKey);
	return { isHovered, isSelected };
}

export type HookState = {
	selectedInfo: SelectedInfoType,
	componentConfigs: ComponentConfigsType
}

export const stateSelector: STATE_PROPS[] = ['selectedInfo', 'componentConfigs']

function SortItem(props: SortItemPropsType) {
	const {
		specialProps,
		specialProps: { key, parentPropName, parentKey, domTreeKeys },
		isFold,
		propName,
		propChildNodes,
	} = props

	const { selectedInfo, componentConfigs } = useSelector(stateSelector,
		(prevState, nextState) => controlUpdate(prevState, nextState, key))
	const { domTreeKeys: nextSDTKeys } = selectedInfo || {}

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
			<Header
				isUnfold={isUnfold}
				specialProps={specialProps}
				propName={propName}
				setIsUnfold={setIsUnfold}
				hasChildNodes={!isEmpty(childNodes)}
				componentName={propName||componentName}
			/>
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
