import { createElement, forwardRef, memo } from 'react';
import {
	clearDropTarget,
	ROOT,
	STATE_PROPS
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
	getComponent,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useSelector } from '../hooks/useSelector';


function NoneContainer(allProps: CommonPropsType, ref: any) {
	const {
		specialProps,
		specialProps: { key, domTreeKeys },
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
