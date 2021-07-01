import { useCallback, useRef } from 'react';
import { formatUnit } from '@brickd/hooks';
import { isEmpty } from 'lodash';
import { ROOT, changeStyles } from '@brickd/core';
import { OriginalPosition } from './useEvents';
import { useOperate } from './useOperate';
import {
	changeElPositionAndSize,
	css,
	EXCLUDE_POSITION,
	getIframe,
} from '../utils';

export function useMouseMove(isSelected:boolean,key:string){
	const originalPositionRef = useRef<OriginalPosition>();
	const { getOperateState } = useOperate();
	const positionResultRef = useRef<any>();

	const onMouseDown = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation();
			if (isSelected && key !== ROOT) {
				const { clientX, clientY, target } = event;
				const targetNode = target as HTMLElement;
				const {
					marginLeft,
					marginTop,
					marginRight,
					marginBottom,
					top,
					left,
					right,
					bottom,
				} = css(targetNode);
				const {
					top: pageTop,
					left: pageLeft,
				} = targetNode.getBoundingClientRect();
				const {
					top: parentPageTop,
					left: parentPageLeft,
				} = targetNode.parentElement.getBoundingClientRect();
				let topPosition = formatUnit(top),
					leftPosition = formatUnit(left);
				const rightPosition = formatUnit(right),
					bottomPosition = formatUnit(bottom);
				if (
					topPosition === 0 &&
					leftPosition === 0 &&
					rightPosition === 0 &&
					bottomPosition === 0
				) {
					if (pageLeft <= parentPageLeft && pageTop >= parentPageTop) {
						topPosition = pageTop - parentPageTop;
						leftPosition = pageLeft - parentPageLeft;
					}
				}
				originalPositionRef.current = {
					topPosition,
					leftPosition,
					rightPosition,
					bottomPosition,
					originalX: clientX,
					originalY: clientY,
					originalMarginLeft: formatUnit(marginLeft),
					originalMarginTop: formatUnit(marginTop),
					originalMarginRight: formatUnit(marginRight),
					originalMarginBottom: formatUnit(marginBottom),
					prevClientX: clientX,
					prevClientY: clientY,
				};

				targetNode.style.transition = 'none';
			}
		},
		[isSelected],
	);

	const onMove = useCallback((event: MouseEvent) => {
		event.stopPropagation();
		getIframe().contentWindow.requestAnimationFrame(() => {
			if (!originalPositionRef.current) return;
			const { clientY, clientX, target } = event;
			const {
				originalY,
				originalX,
				originalMarginLeft,
				originalMarginTop,
				originalMarginBottom,
				originalMarginRight,
				prevClientY,
				prevClientX,
				topPosition,
				leftPosition,
			} = originalPositionRef.current;
			const currentOffsetX = clientX - prevClientX;
			const currentOffsetY = clientY - prevClientY;
			if (
				Math.abs(currentOffsetX) > 500 ||
				Math.abs(currentOffsetY) > 500 ||
				(currentOffsetX === 0 && currentOffsetY === 0)
			) {
				return;
			}
			originalPositionRef.current['prevClientX'] = clientX;
			originalPositionRef.current['prevClientY'] = clientY;
			const targetNode = target as HTMLElement;
			const {
				changeOperationPanel,
				boxChange,
				lockedMarginLeft,
				lockedMarginTop,
			} = getOperateState();
			const offsetY = clientY - originalY;
			const offsetX = clientX - originalX;
			const marginLeft = originalMarginLeft + offsetX;
			const marginTop = originalMarginTop + offsetY;
			const marginRight = originalMarginRight - offsetX;
			const marginBottom = originalMarginBottom - offsetY;
			const top = topPosition + offsetY;
			const left = leftPosition + offsetX;
			let isFlowLayout = true;
			if (EXCLUDE_POSITION.includes(targetNode.style.position)) {
				isFlowLayout = false;
				changeElPositionAndSize(targetNode, { transition: 'none', left, top });
				positionResultRef.current = { left, top };
			} else {
				if (!lockedMarginLeft && !lockedMarginTop) {
					changeElPositionAndSize(targetNode, {
						transition: 'none',
						marginLeft,
						marginTop,
					});
					positionResultRef.current = { marginLeft, marginTop };
				} else if (lockedMarginLeft && !lockedMarginTop) {
					changeElPositionAndSize(targetNode, {
						transition: 'none',
						marginRight,
						marginTop,
					});
					positionResultRef.current = { marginRight, marginTop };
				} else if (!lockedMarginLeft && lockedMarginTop) {
					changeElPositionAndSize(targetNode, {
						transition: 'none',
						marginLeft,
						marginBottom,
					});
					positionResultRef.current = { marginLeft, marginBottom };
				} else {
					changeElPositionAndSize(targetNode, {
						transition: 'none',
						marginRight,
						marginBottom,
					});
					positionResultRef.current = { marginRight, marginBottom };
				}
			}
			boxChange(positionResultRef.current, isFlowLayout);
			changeOperationPanel();
		});
	}, []);

	const onMoveEnd = useCallback((event: DragEvent) => {
		event.stopPropagation();
		const {
			changeBoxDisplay,
		} = getOperateState();
		if (!isEmpty(positionResultRef.current)) {
			changeStyles({ style: positionResultRef.current });
			changeBoxDisplay('none');
			positionResultRef.current = {};
		}
		originalPositionRef.current = null;
	}, []);

	return {onMouseDown,onMove,onMoveEnd};
}
