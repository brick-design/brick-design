import React, { useCallback, useRef,  RefObject } from 'react';
import {css, formatUnit} from '../utils';

export type OriginSizeType = {
	x: number;
	y: number;
	width: number;
	height: number;
	minWidth: number | null;
	minHeight: number | null;
	maxWidth: number | null;
	maxHeight: number | null;
	direction: Direction;
};


export enum Direction {
	top = 'top',
	right = 'right',
	bottom = 'bottom',
	left = 'left',
	topRight = 'topRight',
	bottomRight = 'bottomRight',
	bottomLeft = 'bottomLeft',
	topLeft = 'topLeft',
}

export function useResize(targetRef:RefObject<HTMLElement>){
	const originSizeRef = useRef<OriginSizeType>();

	const onResizeEnd = useCallback(() => {
		originSizeRef.current = undefined;
	}, []);

	const onResize = useCallback((event: React.MouseEvent|MouseEvent) => {
		event.stopPropagation();
		if (originSizeRef.current) {
			const { clientX, clientY } = event;
			const { x, y, direction, height, width } = originSizeRef.current;
			let offsetY = 0;
			let offsetX = 0;
			switch (direction) {
				case Direction.left:
					offsetX = x - clientX;
					break;
				case Direction.right:
					offsetX = clientX - x;
					break;
				case Direction.top:
					offsetY = y - clientY;
					break;
				case Direction.bottom:
					offsetY = clientY - y;
					break;
				case Direction.topLeft:
					offsetY = y - clientY;
					offsetX = x - clientX;
					break;
				case Direction.topRight:
					offsetY = y - clientY;
					offsetX = clientX - x;
					break;
				case Direction.bottomLeft:
					offsetX = x - clientX;
					offsetY = clientY - y;
					break;
				case Direction.bottomRight:
					offsetY = clientY - y;
					offsetX = clientX - x;
					break;
			}
			const heightResult = height + offsetY;
			const widthResult = width + offsetX;
			const {
				minWidth,
				maxHeight,
				maxWidth,
				minHeight,
			} = originSizeRef.current;
			targetRef.current.style.transition = 'none';

			if (
				offsetX !== 0 &&
				(typeof minWidth !=='number' || widthResult >= minWidth) &&
				(typeof maxWidth !=='number' || widthResult <= maxWidth)
			) {
				targetRef.current.style.width = `${widthResult}px`;
			}
			if (
				offsetY !== 0 &&
				(typeof minHeight !=='number' || heightResult >= minHeight) &&
				(typeof maxHeight !=='number' || heightResult <= maxHeight)
			) {
				targetRef.current.style.height = `${heightResult}px`;
			}
		}
	}, []);

	const onResizeStart = useCallback(
		function (
			event: React.MouseEvent|MouseEvent,
			direction: Direction,
		) {
				const {
					width,
					height,
					minWidth,
					minHeight,
					maxWidth,
					maxHeight,
				} = css(targetRef.current);
				originSizeRef.current = {
					x: event.clientX,
					y: event.clientY,
					direction,
					width: formatUnit(width),
					height: formatUnit(height),
					minWidth: formatUnit(minWidth),
					minHeight: formatUnit(minHeight),
					maxWidth: formatUnit(maxWidth),
					maxHeight:formatUnit(maxHeight),
				};
		},
		[],
	);

	return{onResizeStart,onResize,onResizeEnd};
}
