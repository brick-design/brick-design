import React, { useCallback, useRef,memo } from 'react';
import styles from './index.less';
import DragAndResize, { DragAndResizeRefType } from '../DragAndResize';
import { moveIcon } from '../../assets';
import Icon from '../Icon';
import { ResizeableProps } from '../Resizeable';

export interface DragResizeBarType extends ResizeableProps{
	title?:string
}
function DragResizeBar(props:DragResizeBarType){
	const {children,title,className,...rest}=props;
	const dragResizeRef=useRef<DragAndResizeRefType>();

	const onMoveStart=useCallback((event:React.MouseEvent)=>{
		dragResizeRef.current.onMoveStart(event);
	},[]);

	const onClose=useCallback((event:React.MouseEvent)=>{
		event.stopPropagation();
		console.log('onClose>>>>>>>>>>>>');
	},[]);

	return <DragAndResize top bottom right left topLeft topRight bottomLeft bottomRight
												className={`${styles['container']} ${className}`} {...rest} ref={dragResizeRef}>
		<div  className={styles['bar']}>
			<div onMouseDown={onMoveStart} className={styles['drag-bar']}/>
			<span>{title}</span>
			<Icon
				onClick={onClose}
				icon={moveIcon}
				className={`${styles['icon-container']} ${styles['icon-container1']}`}
				iconClass={styles['icon-class']}
			/>
		</div>
		{children}
	</DragAndResize>;
}

export default memo(DragResizeBar);
