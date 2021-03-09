import {
	createElement,
	forwardRef,
	memo,
	useEffect,
	useMemo, useRef,
	useState,
} from 'react';
import {
	ChildNodesType, clearDragSource, DropTargetType,
	getComponentConfig, getDropTarget, PageConfigType,
	PropsNodeType,
	ROOT,
	STATE_PROPS,
} from '@brickd/core';
import { useCommon } from '@brickd/hooks';
import { VirtualDOMType } from '@brickd/utils';
import {
	isEqual,
	get,
	each,
	keys,
	map,
	isEmpty
} from 'lodash';
import {
	generateRequiredProps,
	getComponent, getIframe, getSelectedNode, cloneChildNodes, dragSort, isHorizontal,
	getParentNodes,
	NodeRectsMapType,
	getNodesRects,
	getDragKey, getIsModalChild,
} from '../utils';

import {
	CommonPropsType,
	handleModalTypeContainer,
	propAreEqual,
	handleChildNodes,handlePropsClassName,
} from '../common/handleFuns';
import { useSelect } from '../hooks/useSelect';
import { useChildNodes } from '../hooks/useChildNodes';
import { useSelector } from '../hooks/useSelector';
import {useOperate} from '../hooks/useOperate';
import {useEvents} from '../hooks/useEvents';
/**
 * 所有的容器组件名称
 */

export type ContainerState = {
	pageConfig: PageConfigType
	dropTarget:DropTargetType
}
function Container(allProps: CommonPropsType, ref: any) {
	const {
		specialProps,
		specialProps: { key, domTreeKeys },
		...rest
	} = allProps;

	function controlUpdate(prevState:ContainerState,nextState:ContainerState){
		const {pageConfig:prevPageConfig,dropTarget:prevDropTarget}=prevState;
		const {pageConfig,dropTarget}=nextState;
		return prevPageConfig[key]!==pageConfig[key]||
			get(prevDropTarget,'selectedKey')===key&&get(dropTarget,'selectedKey')!==key||
			get(prevDropTarget,'selectedKey')!==key&&get(dropTarget,'selectedKey')===key;
	}
	const { pageConfig: PageDom,dropTarget } = useSelector<
		ContainerState,
		STATE_PROPS
		>(['dropTarget','pageConfig'],controlUpdate,
	);
	const {selectedKey}=dropTarget||{};
	const pageConfig = PageDom[ROOT] ? PageDom : {} ;
	const vNode=get(pageConfig,key,{}) as VirtualDOMType;
	const { childNodes, componentName} = vNode;
	const{props,hidden}=useCommon(vNode,rest);
	useChildNodes({ childNodes, componentName, specialProps });
	const [children, setChildren] = useState<ChildNodesType | undefined>(childNodes);

	const { mirrorModalField, nodePropsConfig } = useMemo(
		() => getComponentConfig(componentName),
		[],
	);
	const nodePropNames=keys(nodePropsConfig);
	const prevPropName= useRef(nodePropNames.includes('children')?'children':nodePropNames[0]);
	const parentNodes=useRef<{[propName:string]:HTMLElement}>({});
	const nodeRectsMap=useRef<NodeRectsMapType>({});
	const parentRootNode=useRef<HTMLElement>();
	const isModal = useMemo(()=>getIsModalChild(pageConfig, domTreeKeys),[pageConfig,domTreeKeys]);
	const {setOperateState}=useOperate(isModal);
	const parentNodeRect='parentNodeRect';
	// eslint-disable-next-line prefer-const
	let  { selectedDomKeys, isSelected,propName:selectedPropName,lockedKey } = useSelect(
		specialProps,
		!!mirrorModalField,
	);

	if(selectedPropName&&isSelected){
		prevPropName.current=selectedPropName;
	}else {
		selectedPropName=prevPropName.current;
	}
	const {onClick,onDoubleClick,onMouseOver,onDragStart,setSelectedNode}=useEvents(parentRootNode,specialProps,isSelected,selectedPropName);


	const dragOver=(event:DragEvent,childNodes:string[],propName:string)=>{
		event.preventDefault();
		const childRects=map(childNodes,(key)=>nodeRectsMap.current[key]);
		const isHor=isHorizontal(childRects);
		setTimeout(()=>{
			const newChildren=dragSort(getDragKey(),childNodes,childRects,nodeRectsMap.current[parentNodeRect] as DOMRect,event,isHor);
			const renderChildren=cloneChildNodes(childNodes);
					renderChildren[propName]=newChildren;
			if(!isEqual(renderChildren,children)){
				setChildren(renderChildren);
			}
		},100);
	};

	useEffect(()=>{
		if(isEmpty(children)||Array.isArray(children)||isEmpty(parentNodes.current)) return;
		const propNameListeners={};
		each(parentNodes.current,(parentNode,propName)=>{
			// const isSelectedPropName=isSelected&&propName===selectedPropName;

			propNameListeners[propName]={
				dragOver:(event)=>dragOver(event,children[propName],propName),
				dragEnter:(event)=>onDragEnter(event,propName)
			};
			// isSelectedPropName&&parentNode.addEventListener('dragover',propNameListeners[propName].dragOver);
			parentNode.addEventListener('dragenter',get(propNameListeners,[propName,'dragEnter']));

		});

		return()=>{
			each(parentNodes.current,(parentNode,propName)=>{
				// const isSelectedPropName=isSelected&&propName===selectedPropName;
				// isSelectedPropName&&parentNode.removeEventListener('dragover',propNameListeners[propName].dragOver);
				parentNode.removeEventListener('dragenter',get(propNameListeners,[propName,'dragEnter']));
			});
		};
	});

	useEffect(()=>{
		if(!parentRootNode.current&&!getDragKey()){
			const iframe=getIframe();
			parentRootNode.current=getSelectedNode(key,iframe);
			isSelected&&setSelectedNode(parentRootNode.current);
		}
		const parentRect= parentRootNode.current?parentRootNode.current.getBoundingClientRect():null;
		if(!nodeRectsMap.current[parentNodeRect]&&parentRect){
			nodeRectsMap.current[parentNodeRect]=parentRect;
		}
		const isRest=!isEqual(nodeRectsMap.current[parentNodeRect],parentRect);
		if(childNodes&&nodePropsConfig){
			getParentNodes(childNodes as PropsNodeType,parentNodes.current,key);
		}
		getNodesRects(nodeRectsMap,childNodes,isRest);
	});

	// useEffect(()=>{
	// 	if(!isSelected||isEmpty(parentRootNode.current)||nodePropsConfig) return ;
	// 	const tempChildNodes=childNodes as string[];
	// 	const childRects=map(tempChildNodes,(key)=>nodeRectsMap.current[key]);
	// 	const isHor=isHorizontal(childRects);
	// 	const dragOver=(event:DragEvent)=>{
	// 		event.preventDefault();
	// 		setTimeout(()=>{
	// 			const newChildren=dragSort(getDragKey(),tempChildNodes,childRects,nodeRectsMap.current[parentNodeRect] as DOMRect,event,isHor);
	// 				if(!isEqual(newChildren,children)){
	// 					setChildren(newChildren);
	// 				}
	// 		},100);
	// 	};
	//
	// 	parentRootNode.current.addEventListener('dragover',dragOver);
	// 	return ()=>{
	// 		parentRootNode.current.removeEventListener('dragover',dragOver);
	//
	// 	};
	// });


	if(selectedKey!==key&&!isEqual(childNodes,children)){
		setChildren(childNodes);
	}

	const onParentDragEnter = (e: DragEvent) => {
		e.stopPropagation();
		const dragKey=getDragKey();
		if(key===dragKey||nodePropsConfig&&isEmpty(children)) return;
		getDropTarget({
			propName:selectedPropName,
			selectedKey:key,
			domTreeKeys,
		});
		setOperateState({dropNode:parentRootNode.current});
		setTimeout(()=>{
			if(nodePropsConfig){
				if(!childNodes||Array.isArray(childNodes)){
					setChildren({[selectedPropName]:[dragKey]});
				}else {
					if(!get(childNodes,selectedPropName,[]).includes(dragKey)){
						const newChildren=cloneChildNodes(childNodes);
						const chidChildren=get(newChildren,selectedPropName,[]);
						newChildren[selectedPropName]=[...new Set([dragKey,...chidChildren])];
						setChildren(newChildren);
					}

				}
			}else if(Array.isArray(children)) {
				if(children.includes(dragKey)) return;
				setChildren([dragKey,...children]);
			}else {
				setChildren([dragKey]);

			}
		},0);

	};

	const onDragEnter = (e: DragEvent,propName?:string) => {
		e.stopPropagation();
		const dragKey=getDragKey();
		if(key===dragKey) return;
		setOperateState({dropNode:parentNodes.current[propName]});

		setTimeout(()=>{
				if(!children||Array.isArray(children)){
					setChildren({[propName]:[dragKey]});
				}else {
					const newChildren=cloneChildNodes(childNodes);
					const chidChildren=get(newChildren,propName,[]);
					if(!chidChildren.includes(dragKey)){
						newChildren[propName]=[...new Set([dragKey,...chidChildren])];
					}
						setChildren(newChildren);
				}
		},0);
		getDropTarget({
			propName,
			selectedKey:key,
			domTreeKeys,
		});
	};


	if (!isSelected&&(!componentName||hidden)) return null;

	let modalProps: any = {};
	if (mirrorModalField) {
		const { displayPropName, mountedProps } = handleModalTypeContainer(
			mirrorModalField,
		);
		const isVisible = isSelected || (selectedDomKeys && selectedDomKeys.includes(key));
		modalProps =isVisible? { [displayPropName]: isVisible, ...mountedProps }:mountedProps;
	}
	const { className, animateClass, ...restProps } = props || {};


	const dragKey=getDragKey();

	return createElement(getComponent(componentName), {
		...restProps,
		className: handlePropsClassName(key,dragKey===key||dragKey&&!isSelected&&domTreeKeys.includes(lockedKey),className,animateClass),
		onMouseOver,
		onDragStart,
		onDragEnter:onParentDragEnter,
		onDoubleClick,
		onClick,
		onDragEnd:clearDragSource,
		...generateRequiredProps(componentName),
		...handleChildNodes(specialProps,pageConfig,children),
		...props,
		draggable: true,
		/**
		 * 设置组件id方便抓取图片
		 */
		ref,
		...modalProps,
	});
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);
