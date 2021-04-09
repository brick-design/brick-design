import React, { useCallback, useEffect, useRef } from 'react';
import {isEmpty} from 'lodash';
import styles from './index.less';
import { formatUnit, getIframe } from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import {  Radius } from './index';

interface ItemProps {
	radius: Radius;
	changeBaseboard:()=>void
}

const radiusStyles: { [key: string]: React.CSSProperties } = {
	borderTopRightRadius: {
		right: '5px',
		top: '5px',
		cursor: 'ne-resize',
	},
	borderBottomRightRadius: {
		right: '5px',
		bottom: '5px',
		cursor: 'se-resize',
	},
	borderBottomLeftRadius: {
		left: '5px',
		bottom: '5px',
		cursor: 'sw-resize',
	},
	borderTopLeftRadius: {
		left: '5px',
		top: '5px',
		cursor: 'nw-resize',
	},
};

type OriginRadiusType = {
	x: number;
	y: number;
	radius: Radius;
	borderTopLeftRadius:number,
	borderTopRightRadius:number,
	borderBottomLeftRadius:number,
	borderBottomRightRadius:number,
	height:number,
	width:number
};

export function RadiusItem(props: ItemProps,ref:any) {
	const {changeBaseboard}=props;
	const originRadiusRef=useRef<OriginRadiusType>();
	const radiusResultRef=useRef({});
	const nodeRef=useRef<HTMLElement>();
	const iframe = useRef(getIframe()).current;
	const { getOperateState } = useOperate();

	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation();
			const { selectedNode } = getOperateState();

			if (!isEmpty(originRadiusRef.current)) {
				const { clientX, clientY } = event;
				const { x, y, radius,
					borderTopLeftRadius,
					borderTopRightRadius,
					borderBottomLeftRadius,
					borderBottomRightRadius } = originRadiusRef.current;
				let offsetY = 0;
				let offsetX = 0;
				let offsetR=0;
				let top=5,left=5,right=5,bottom=5;
				switch (radius) {
					case Radius.topLeft:
						left=top=borderTopLeftRadius||top;
						offsetY = clientY-y;
						offsetX = clientX-x;
						offsetR=Math.max(offsetY,offsetX);
						nodeRef.current.style.top=`${top+offsetR}px`;
						nodeRef.current.style.left=`${left+offsetR}px`;
						break;
					case Radius.topRight:
						right=top=borderTopRightRadius||top;
						offsetY = clientY-y;
						offsetX = x-clientX;
						offsetR=Math.max(offsetY,offsetX);
						nodeRef.current.style.top=`${top+offsetR}px`;
						nodeRef.current.style.right=`${right+offsetR}px`;
						break;
					case Radius.bottomLeft:
						bottom=left=borderBottomLeftRadius||bottom;
						offsetX = clientX-x;
						offsetY = y-clientY;
						offsetR=Math.max(offsetY,offsetX);
						nodeRef.current.style.bottom=`${bottom+offsetR}px`;
						nodeRef.current.style.left=`${left+offsetR}px`;
						break;
					case Radius.bottomRight:
						bottom=right=borderBottomRightRadius||bottom;

						offsetY = y-clientY ;
						offsetX =  x-clientX;
						offsetR=Math.max(offsetY,offsetX);
						nodeRef.current.style.bottom=`${bottom+offsetR}px`;
						nodeRef.current.style.right=`${right+offsetR}px`;
						break;
				}
				selectedNode.style[radius]=`${offsetR}px`;
			}
		},
		[],
	);
	const onRadiusStart = useCallback(
		function (event: React.MouseEvent<HTMLSpanElement>, radius: Radius) {
			const { selectedNode } = getOperateState();
			if (event.nativeEvent && iframe) {
				const { contentWindow } = iframe!;
				const {
					borderTopLeftRadius,
					borderTopRightRadius,
					borderBottomLeftRadius,
					borderBottomRightRadius,
					width,
					height
				} = contentWindow!.getComputedStyle(selectedNode);
				originRadiusRef.current = {
					x: event.nativeEvent.clientX,
					y: event.nativeEvent.clientY,
					radius,
					borderTopLeftRadius:formatUnit(borderTopLeftRadius),
					borderTopRightRadius:formatUnit(borderTopRightRadius),
					borderBottomLeftRadius:formatUnit(borderBottomLeftRadius),
					borderBottomRightRadius:formatUnit(borderBottomRightRadius),
					width:formatUnit(width),
					height:formatUnit(height)
				};
				changeBaseboard();
			}
		},
		[],
	);

	const onMouseUp = useCallback(() => {
		originRadiusRef.current = undefined;
		radiusResultRef.current = {};
	}, []);


	useEffect(() => {
		const contentWindow = iframe!.contentWindow!;

		contentWindow.addEventListener('mouseup', onMouseUp);
		contentWindow.addEventListener('mousemove', onMouseMove);

		return () => {
			contentWindow.removeEventListener('mouseup', onMouseUp);
			contentWindow.removeEventListener('mousemove', onMouseMove);
		};
	}, []);


	const {  radius } = props;
	return (
		<span
			ref={nodeRef}
			style={radiusStyles[radius]}
			onMouseDown={(e) => onRadiusStart(e, radius)}
			className={styles['radius-item']}
		/>
	);
}
