import { createElement, forwardRef, memo, useMemo } from 'react';
import {
	clearDropTarget,
	ROOT,
	STATE_PROPS,
} from '@brickd/core';
import { useSelector } from '@brickd/redux-bridge';
import { dataMapping} from '@brickd/utils';
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
	getComponent, isHiddenComponent,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useGetState } from '../hooks/useGetState';
import { useService } from '../hooks/useService';
import { useComponentState } from '../hooks/useComponetState';

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
	const { props:prevProps, componentName,state,api,isHidden } = pageConfig[key] || {};
	useService(key,api);
	useComponentState(key,state);
	const pageState=useGetState(key);
	const props=useMemo(()=>dataMapping(prevProps,pageState),[pageState]);
	if (!componentName||isHiddenComponent(isHidden,pageState)) return null;

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
