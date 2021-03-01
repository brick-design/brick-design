import React, { AllHTMLAttributes, createElement } from 'react';
import {
	ChildNodesType,
	clearDragSource,
	PageConfigType,
	getComponentConfig,
	isContainer,
	MirrorModalFieldType,
	PROPS_TYPES,
	PropsNodeType,
	SelectedInfoBaseType,
	STATE_PROPS,
} from '@brickd/core';
import { each, isEmpty, isEqual, map } from 'lodash';
import { FunParamContextProvider } from '@brickd/hooks';
import styles from './style.less';
import { handleSelectedStatus, onDragStart, onMouseOver } from './events';
import { selectClassTarget } from './constants';
import Container from '../warppers/Container';
import NoneContainer from '../warppers/NoneContainer';
import { generateRequiredProps, getComponent, getIframe } from '../utils';
import StateDomainWarpper from '../warppers/StateDomainWarpper';

/**
 * 处理样式
 * @param key
 * @param isHidden
 * @param isDragTarget
 * @param className
 * @param animateClass
 * @param isDropTarget
 */
export function handlePropsClassName(
	key: string,
	isHidden: boolean,
	isDragTarget: boolean,
	className: any,
	animateClass: string,
) {
	return `${selectClassTarget + key} ${className} ${animateClass} ${styles['drag-transitionEnd']} ${
		isDragTarget ? styles['forbid-event'] : styles['allow-event']
	} ${isHidden && styles['hidden-component']}`;
}

export type DragAddStatusType = {
	dragKey?: string
	isDragAdd?: boolean
	isDragAddChild?: boolean
}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param specialProps
 * @param pageConfig
 * @param dragAddStatus
 * @param parentPropName
 * @param isOnlyNode
 */
function renderNodes(
	childNodes: string[],
	specialProps: SelectedInfoBaseType,
	pageConfig: PageConfigType,
	dragAddStatus: DragAddStatusType,
	parentPropName?: string,
	isOnlyNode?: boolean,
) {
	const { dragKey, isDragAdd, isDragAddChild } = dragAddStatus;
	let { domTreeKeys } = specialProps;
	const parentKey = specialProps.key;
	if (parentPropName) {
		domTreeKeys = [...domTreeKeys, `${parentKey}${parentPropName}`];
	}
	const resultChildNodes = map(childNodes, (key) => {
		const { componentName,isStateDomain } = pageConfig[key] || {};
		if (!componentName) return null;
		/** 根据组件类型处理属性 */
		const specialProps={
				key,
				domTreeKeys: [...domTreeKeys, key],
				parentKey,
				parentPropName,
			};
		if(isStateDomain) return  <StateDomainWarpper key={key} specialProps={specialProps} isDragAddChild={isDragAddChild || (dragKey === key && isDragAdd)}/>;
		return isContainer(componentName) ? (
			<Container
				specialProps={specialProps}
				isDragAddChild={isDragAddChild || (dragKey === key && isDragAdd)}
				key={key}
			/>
		) : (
			<NoneContainer
				specialProps={specialProps}
				isDragAddChild={isDragAddChild || (dragKey === key && isDragAdd)}
				key={key}
			/>
		);
	});
	/** 如果该组件子节点或者属性子节点要求为单组件返回子组件的第一组件*/
	if (isOnlyNode) {
		return resultChildNodes[0];
	}

	return resultChildNodes;
}

function renderRequiredChildNodes(childNodesRule?: string[]) {
	if (childNodesRule) {
		const componentName = childNodesRule[0];
		return createElement(
			getComponent(componentName),
			generateRequiredProps(componentName),
		);
	} else {
		return <div />;
	}
}

function handleRequiredChildNodes(componentName: string) {
	const { isRequired, nodePropsConfig, childNodesRule } = getComponentConfig(
		componentName,
	);
	const nodeProps: any = {};
	if (isRequired) {
		nodeProps.children = renderRequiredChildNodes(childNodesRule);
	} else if (nodePropsConfig) {
		each(nodePropsConfig, (propConfig, key) => {
			const { isRequired, childNodesRule } = propConfig;
			if (isRequired) {
				nodeProps[key] = renderRequiredChildNodes(childNodesRule);
			}
		});
	}
	return nodeProps;
}

export function handleChildNodes(
	specialProps: SelectedInfoBaseType,
	pageConfig: PageConfigType,
	children?: ChildNodesType,
	dragKey?: string,
	isDragAdd?: boolean,
	isDragAddChild?: boolean,
) {
	const nodeProps: any = {};
	const { key: parentKey } = specialProps;
	const { componentName } = pageConfig[parentKey];
	if (isEmpty(children)) {
		return handleRequiredChildNodes(componentName);
	}
	const dragAddStatus: DragAddStatusType = {
		isDragAdd,
		dragKey,
		isDragAddChild,
	};
	const { nodePropsConfig, isOnlyNode } = getComponentConfig(componentName);
	if (Array.isArray(children)) {
		nodeProps.children = renderNodes(
			children,
			specialProps,
			pageConfig,
			dragAddStatus,
			undefined,
			isOnlyNode,
		);
	} else {
		console.log('children>>>>>>.',children);
		each(children, (nodes, propName: string) => {
			const { isOnlyNode, isRequired, childNodesRule } = nodePropsConfig![propName];
			if (isEmpty(nodes)){
				return (
					isRequired &&
					(nodeProps[propName] = renderRequiredChildNodes(childNodesRule))
				);
			}

			if(propName.includes('#')){
				const realPropName=propName.substring(1);
				// eslint-disable-next-line react/display-name
				nodeProps[realPropName]= (...funParams)=>{
					return(<FunParamContextProvider value={funParams}>
						{renderNodes(
						nodes,
						specialProps,
						pageConfig,
						dragAddStatus,
						propName,
						isOnlyNode,
					)}</FunParamContextProvider>) ;
				};
			}else {
				nodeProps[propName] = renderNodes(
					nodes,
					specialProps,
					pageConfig,
					dragAddStatus,
					propName,
					isOnlyNode,
				);
			}
		});
	}

	return nodeProps;
}

/**
 * 处理弹窗类容器
 * @param mirrorModalField
 * @param iframeId
 */
export function handleModalTypeContainer(
	mirrorModalField: MirrorModalFieldType,
) {
	const mountedProps: any = {};
	const { displayPropName, mounted } = mirrorModalField;
	if (mounted) {
		const { propName, type } = mounted;
		const iframe: any = getIframe();
		const mountedNode = iframe.contentDocument.body;
		mountedProps[propName] =
			type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
	}

	return { displayPropName, mountedProps };
}

/**
 * 处理容器组件属性
 * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
 */
export function handleEvents(
	specialProps: SelectedInfoBaseType,
	isSelected: boolean,
	childNodes?: ChildNodesType,
) {
	const { key, parentKey, parentPropName } = specialProps;
	let propName: string | undefined;
	if (childNodes && !Array.isArray(childNodes)) {
		propName = Object.keys(childNodes as PropsNodeType)[0];
	}
	return {
		onDoubleClick: (e: Event) =>
			handleSelectedStatus(e, isSelected, specialProps, propName),
		onClick:(e: Event)=>{
			if(isSelected){
				handleSelectedStatus(e, isSelected, specialProps, propName);
			}
		},
		onMouseOver: (e: Event) => onMouseOver(e, key, isSelected),
		onDragStart: (e: Event) => onDragStart(e, key, parentKey!, parentPropName),
		onDragEnd: () => clearDragSource(),
	};
}

export type HookState = {
	pageConfig: PageConfigType
}

export const stateSelector: STATE_PROPS[] = [
	'pageConfig',
];

export function controlUpdate(
	prevState: HookState,
	nextState: HookState,
	key: string,
) {
	return prevState.pageConfig[key] !== nextState.pageConfig[key];
}

export interface CommonPropsType extends AllHTMLAttributes<any> {
	specialProps: SelectedInfoBaseType
	isDragAddChild?: boolean
	[propsName: string]: any
}

export function propAreEqual(
	prevProps: CommonPropsType,
	nextProps: CommonPropsType,
): boolean {
	const {
		specialProps: prevSpecialProps,
		isDragAddChild: prevIsDragAddChild,
		...prevRest
	} = prevProps;
	const { specialProps, isDragAddChild, ...rest } = nextProps;
	return (
		isEqual(prevRest, rest) &&
		isEqual(prevSpecialProps, specialProps) &&
		prevIsDragAddChild === isDragAddChild
	);
}
