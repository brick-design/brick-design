import React, { useCallback, useRef } from 'react';

export interface MoveType {
	x?: number;
	y?: number;
	top?: number;
	left?: number;
	isMove: boolean;
}
export function useDragMove(getTarget:()=>HTMLElement){
	const originPositionRef = useRef<MoveType>({ isMove: false });
	const onMoveStart = useCallback(
		function (event: MouseEvent|React.MouseEvent) {
			event.stopPropagation();
			if(!getTarget()) return;
			const { top, left } = getComputedStyle(getTarget(), '');
			originPositionRef.current = {
				x: event.clientX,
				y: event.clientY,
				top: Number.parseInt(top),
				left: Number.parseInt(left),
				isMove: true,
			};
			const target=getTarget();
			target.style.pointerEvents='none';
			target.style.transition='none';
		},
		[],
	);

	const onMoveEnd = useCallback(
		function (event: MouseEvent|React.MouseEvent) {
			event.stopPropagation();
			originPositionRef.current.isMove = false;
			getTarget().style.pointerEvents='auto';
		},
		[],
	);

	const onMove = useCallback(function (event: MouseEvent|React.MouseEvent) {
		event.stopPropagation();
		if (!originPositionRef.current.isMove) return;
		const { clientX, clientY } = event;
		const { x, y, top, left } = originPositionRef.current;
		const offsetY = clientY - y;
		const offsetX = clientX - x;
		const newLeft = left + offsetX;
		getTarget().style.left = newLeft+ 'px';
		const newTop = top + offsetY;
		getTarget().style.top = newTop + 'px';
		originPositionRef.current = {
			x: clientX,
			y: clientY,
			top: newTop,
			left: newLeft,
			isMove: true,
		};
	}, []);

	return {onMoveStart,onMove,onMoveEnd};
}
