import {
	createElement,
	forwardRef,
	memo, useCallback,
	useEffect,
	useMemo, useRef,
	useState,
} from 'react';
import {
	ChildNodesType,
	getComponentConfig, getDragSource,
	// handleRules,
	ROOT,
	STATE_PROPS,
} from '@brickd/core';
import { useCommon } from '@brickd/hooks';
import { VirtualDOMType } from '@brickd/utils';
import {
	isEmpty,
	isEqual,
	isObject,
get} from 'lodash';
import {
	generateRequiredProps,
	getComponent, getIframe, getSelectedNode, getChildRects, cloneChildNodes, dragSort, isHorizontal,
	// isHorizontal,
} from '../utils';

import {
	CommonPropsType,
	controlUpdate,
	handleChildNodes,
	handleEvents,
	handleModalTypeContainer,
	handlePropsClassName,
	HookState,
	propAreEqual,
	stateSelector,
} from '../common/handleFuns';
import { getDropTargetInfo } from '../common/events';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useChildNodes } from '../hooks/useChildNodes';
import { useSelector } from '../hooks/useSelector';


/**
 * 所有的容器组件名称
 */
function Container(allProps: CommonPropsType, ref: any) {
	const {
		specialProps,
		specialProps: { key, domTreeKeys ,parentKey,parentPropName},
		isDragAddChild,
		...rest
	} = allProps;

	const { pageConfig: PageDom } = useSelector<
		HookState,
		STATE_PROPS
	>(stateSelector, (prevState, nextState) =>
		controlUpdate(prevState, nextState, key),
	);
	const { dragSource, dropTarget,isInvisible } = useDragDrop(key);
	const { dragKey, vDOMCollection } = dragSource || {};
	const { selectedKey } = dropTarget || {};
	const pageConfig = PageDom[ROOT] ? PageDom : vDOMCollection||{} ;
	const vNode=get(pageConfig,key,{}) as VirtualDOMType;
	const { childNodes, componentName} = vNode;
	const{props,hidden}=useCommon(vNode,rest);
	useChildNodes({ childNodes, componentName, specialProps });
	const [children, setChildren] = useState<ChildNodesType | undefined>(childNodes);
	const { mirrorModalField, nodePropsConfig } = useMemo(
		() => getComponentConfig(componentName),
		[],
	);
	const nodePropNameRef=useRef(childNodes&&!Array.isArray(childNodes)?Object.keys(childNodes)[0]:isObject(nodePropsConfig)?Object.keys(nodePropsConfig)[0]:undefined);
	const { selectedDomKeys, isSelected,propName } = useSelect(
		specialProps,
		!!mirrorModalField,
	);

	if(propName&&isSelected&&nodePropNameRef.current!==propName){
		nodePropNameRef.current=propName;
	}

	const onDragStart=useCallback((event: DragEvent)=> {
		const img = document.createElement('img');
		img.src = 'http://path/to/img';
		event.dataTransfer.setDragImage(img,0,0);
		setTimeout(() => {
			getDragSource({
				dragKey:key,
				parentKey,
				parentPropName,
			});
		}, 0);
	},[parentKey,parentPropName,key]);

	useEffect(()=>{
		const iframe=getIframe();
		const node=getSelectedNode(key,iframe);
		if(!node||isDragAddChild) return;
		if(dragKey===key) {
			node.style.pointerEvents = 'none';
			return;
		}else {
			node.style.pointerEvents = 'auto';
		}
		let childRects=[];
		let compareChildren=[];
		if(!isEmpty(children)){
			if(Array.isArray(children)){
				compareChildren=[...children];
				childRects=getChildRects(compareChildren,iframe);
			}else {
				compareChildren=[...children[nodePropNameRef.current]];
				childRects=getChildRects(compareChildren,iframe);
			}
		}
		const parentRect=node.getBoundingClientRect();

		const isHor=isHorizontal(childRects,parentRect);
		const dragOver=(event:DragEvent)=>{
			event.preventDefault();
			if(selectedKey!==key||dragKey===key) return ;
			setTimeout(()=>{
					const dragIndex=compareChildren.indexOf(dragKey);
					if(dragIndex>=0){
						compareChildren.splice(dragIndex,1);
						childRects.splice(dragIndex,1);
					}
				const newChildren=dragSort(compareChildren,dragKey,childRects,parentRect as DOMRect,event,isHor);
					let renderChildren=cloneChildNodes(children);
					if(nodePropNameRef.current){
						if(!renderChildren||Array.isArray(renderChildren)){
							renderChildren={[nodePropNameRef.current]:newChildren};
						}else {
							renderChildren[nodePropNameRef.current]=newChildren;
						}
					}else {
						renderChildren=newChildren;
					}
					if(!isEqual(renderChildren,children)){
						console.log('renderChildren>>>>>',renderChildren,children);
						setChildren(renderChildren);
					}

			},200);
		};

		if(node){
			node.addEventListener('dragover',dragOver);
			node.addEventListener('dragstart',onDragStart);

		}
		return ()=>{
			if(node){
				node.removeEventListener('dragover',dragOver);
				node.removeEventListener('dragstart',onDragStart);


			}
		};
	});

	const onDragEnter = (e: Event) => {
		e.stopPropagation();
		if(key===dragKey) return;
		getDropTargetInfo(e, domTreeKeys, key, nodePropNameRef.current);
	};
	const onDragLeave = (e: Event) => {
		e.stopPropagation();
		// clearDropTarget();
	};

	if ((!selectedKey || selectedKey !== key) && !isEqual(childNodes,children)) {
		setChildren(childNodes);
	}
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
	return createElement(getComponent(componentName), {
		...restProps,
		className: handlePropsClassName(
			key,
			isInvisible && !isDragAddChild,
			dragKey === key,
			className,
			animateClass,
		),
		...(isDragAddChild
			? {}
			: {
					onDragEnter,
					onDragLeave,
					...handleEvents(specialProps, isSelected, childNodes),
			  }),
		...generateRequiredProps(componentName),
		...handleChildNodes(
			specialProps,
			pageConfig,
			children!,
			dragKey,
			!isEqual(childNodes,children),
			isDragAddChild,
		),
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
