import React, { AllHTMLAttributes, createElement } from 'react';
import {
	ChildNodesType,
	PageConfigType,
	getComponentConfig,
	isContainer,
	MirrorModalFieldType,
	PROPS_TYPES,
	SelectedInfoBaseType,
	STATE_PROPS,
} from '@brickd/core';
import { each, isEmpty, isEqual, map } from 'lodash';
import { FunParamContextProvider,MapNodeContextProvider} from '@brickd/hooks';

import { resolveMapping,isPureVariable } from '@brickd/utils';
import styles from './style.less';
import { selectClassTarget } from './constants';
import Container from '../wrappers/Container';
import NoneContainer from '../wrappers/NoneContainer';
import { generateRequiredProps, getComponent, getIframe } from '../utils';
import StateDomainWrapper from '../wrappers/StateDomainWrapper';

export function handlePropsClassName(
	key: string,
	isDragTarget: boolean,
	className: any,
	animateClass: string,
) {
	return `${selectClassTarget + key} ${className} ${animateClass} ${styles['drag-transitionEnd']} ${
		isDragTarget ? styles['forbid-event'] : styles['allow-event']
	}`;
}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param specialProps
 * @param pageConfig
 * @param parentPropName
 * @param isOnlyNode
 */
function renderNodes(
	childNodes: string[],
	specialProps: SelectedInfoBaseType,
	pageConfig: PageConfigType,
	getPageState:()=>any,
parentPropName?: string,
	isOnlyNode?: boolean,
) {
	let { domTreeKeys } = specialProps;
	const parentKey = specialProps.key;
	if (parentPropName) {
		domTreeKeys = [...domTreeKeys, `${parentKey}${parentPropName}`];
	}
	const resultChildNodes = map(childNodes, (key) => {
		const { componentName,isStateDomain,loop } = pageConfig[key] || {};
		if (!componentName) return null;
		/** 根据组件类型处理属性 */
		const specialProps={
				key,
				domTreeKeys: [...domTreeKeys, key],
				parentKey,
				parentPropName,
			};
		if(isStateDomain) return  <StateDomainWrapper key={key} specialProps={specialProps}/>;

		const node=isContainer(componentName) ? (
			<Container
				specialProps={specialProps}
				key={key}
			/>
		) : (
			<NoneContainer
				specialProps={specialProps}
				key={key}
			/>
		);
		if(isPureVariable(loop)){
			const state= getPageState() ;
			return  map(resolveMapping(loop,state),(item,index)=>{
				return <MapNodeContextProvider key={item.id||index} value={item}>
					{node}
				</MapNodeContextProvider>;
			});
		}
		return node;
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
	getPageState:()=>any,
	children?: ChildNodesType,
) {
	const nodeProps: any = {};
	const { key: parentKey } = specialProps;
	const { componentName } = pageConfig[parentKey];
	if (isEmpty(children)) {
		return handleRequiredChildNodes(componentName);
	}
	const { nodePropsConfig, isOnlyNode } = getComponentConfig(componentName);
	if (Array.isArray(children)) {
		nodeProps.children = renderNodes(
			children,
			specialProps,
			pageConfig,
			getPageState,
			undefined,
			isOnlyNode,

		);
	} else {
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
							getPageState,
						propName,
						isOnlyNode,

					)}</FunParamContextProvider>) ;
				};
			}else {
				nodeProps[propName] = renderNodes(
					nodes,
					specialProps,
					pageConfig,
					getPageState,
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
	[propsName: string]: any
}

export function propAreEqual(
	prevProps: CommonPropsType,
	nextProps: CommonPropsType,
): boolean {
	const {
		specialProps: prevSpecialProps,
		...prevRest
	} = prevProps;
	const { specialProps, ...rest } = nextProps;
	return (
		isEqual(prevRest, rest) &&
		isEqual(prevSpecialProps, specialProps)
	);
}
