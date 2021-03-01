import { createElement, forwardRef, memo, useCallback, useEffect } from 'react';
import {
	clearDropTarget, getDragSource,
	ROOT,
	STATE_PROPS,
} from '@brickd/core';
import { useCommon } from '@brickd/hooks';
import { VirtualDOMType } from '@brickd/utils';
import {
	CommonPropsType,
	controlUpdate,
	handleEvents,
	handlePropsClassName,
	HookState,
	propAreEqual,
	stateSelector,
} from '../common/handleFuns';
import {
	generateRequiredProps,
	getComponent, getIframe, getSelectedNode,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useSelector } from '../hooks/useSelector';


function NoneContainer(allProps: CommonPropsType, ref: any) {
	const {
		specialProps,
		specialProps: { key, domTreeKeys,parentKey,parentPropName },
		isDragAddChild,
		...rest
	} = allProps;
	const { pageConfig: PageDom } = useSelector<
		HookState,
		STATE_PROPS
	>(stateSelector, (prevState, nextState) =>
		controlUpdate(prevState, nextState, key),
	);

	const { isSelected } = useSelect(specialProps);
	const { dragSource,isInvisible} = useDragDrop(key);
	const { dragKey, vDOMCollection } = dragSource || {};
	const pageConfig = PageDom[ROOT] ? PageDom : vDOMCollection || {};
	const vNode=(pageConfig[key] || {}) as VirtualDOMType;
	const {componentName} = vNode;
	const{props,hidden}=useCommon(vNode,rest);
	if (!isSelected&&(!componentName||hidden)) return null;

	const onDragEnter = (e: Event) => {
		e.stopPropagation();
		if (dragKey && domTreeKeys.includes(dragKey)) {
			clearDropTarget();
		}
	};


	const onDragStart=useCallback((event: DragEvent)=> {
		event.stopPropagation();
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
		if(node){
			if(dragKey) {
				node.style.pointerEvents='none';
			}else {
				node.style.pointerEvents='auto';
			}
			node.addEventListener('dragstart',onDragStart);
		}

		return ()=>{
			if(node){
				node.removeEventListener('dragstart',onDragStart);
			}};
	});

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
					...handleEvents(specialProps, isSelected),
			  }),
		...generateRequiredProps(componentName),
		...props,
		draggable: true,
		/**
		 * 设置组件id方便抓取图片
		 */
		ref,
		...rest,
	});
}

export default memo<CommonPropsType>(forwardRef(NoneContainer), propAreEqual);
