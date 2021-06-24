import React, { useCallback, useRef, memo } from 'react';
import { css } from '@brickd/react';
import styles from './index.less';
import DragAndResize, { DragAndResizeRefType } from '../DragAndResize';
import { moveIcon } from '../../assets';
import Icon  from '../Icon';
import { ResizeableProps } from '../Resizeable';

export interface DragResizeBarType extends ResizeableProps{
	title?:string
	icon?: string
	btnLeft?:number
}

type OriginPositionType={
	width?:string;
	height?:string;
	top?:string;
	left?:string
}


function DragResizeBar(props:DragResizeBarType){
	const {children,title,className,icon,btnLeft,...rest}=props;
	const dragResizeRef=useRef<DragAndResizeRefType>();
	const isShowRef=useRef(true);
	const originPositionRef=useRef<OriginPositionType>();

	const onMoveStart=useCallback((event:React.MouseEvent)=>{
		dragResizeRef.current.onMoveStart(event);
	},[]);




	const closePanel=()=>{
		const target=dragResizeRef.current.target;
		const {top,left,width,height}=css(target);
		originPositionRef.current={top,left,width,height};
		target.style.top='10px';
		target.style.left=btnLeft+'px';
		target.style.width='35px';
		target.style.height='35px';
		target.style.transition='all 500ms';
		isShowRef.current=false;

	};

	const onClick=(event:React.MouseEvent)=>{
		event.stopPropagation();
		const target=dragResizeRef.current.target;
		if(isShowRef.current){
			closePanel();
		}else {
			const {top,left,width}=originPositionRef.current;
			target.style.top=top;
			target.style.left=left;
			target.style.width=width;
			target.style.height='auto';
			target.style.transition='all 500ms';
			isShowRef.current=true;
		}
	};

	return <>
		<DragAndResize top bottom right left topLeft topRight bottomLeft bottomRight
									 className={`${styles['container']} ${className}`} {...rest} ref={dragResizeRef}>
		<div  className={styles['bar']}>
			<div onMouseDown={onMoveStart} className={styles['drag-bar']}/>
			<span>{title}</span>
			<Icon
				onClick={closePanel}
				icon={moveIcon}
				className={`${styles['icon-container']} ${styles['icon-container1']}`}
				iconClass={styles['icon-class']}
			/>
		</div>
		{children}
	</DragAndResize>
		<Icon icon={icon}
					style={{left:btnLeft}}
					onClick={onClick}
					className={styles['icon-Menu']}
					iconClass={styles['icon-class']}/>
	</>;
}

export default memo(DragResizeBar);
