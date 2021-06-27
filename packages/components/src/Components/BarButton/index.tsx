import React, { memo, useRef, useEffect, RefObject, useImperativeHandle, Ref, useCallback, forwardRef } from 'react';
import {merge} from 'lodash';
import { DragAndResizeRefType } from '../DragAndResize';
import styles from '../../global.less';
import Icon from '../Icon';


type OriginPositionType={
	width?:string;
	height?:string;
	top?:string;
	left?:string;
	targetLeft?:string;
	targetTop?:string;
	targetWidth?:string;
	targetHeight?:string
}

export type BarButtonProps={
	icon:string
	dragResizeRef:RefObject<DragAndResizeRefType>
	children:any
	defaultShow?:boolean
}

export type BarButtonRefType={
	closePanel:()=>void
}
function BarButton(props:BarButtonProps,ref:Ref<BarButtonRefType>){
	const {icon,dragResizeRef,children,defaultShow}=props;
	const isShowRef=useRef(defaultShow);
	const originPositionRef=useRef<OriginPositionType>({});
	const iconRef=useRef<HTMLDivElement>();

	useImperativeHandle(ref,()=>({closePanel}));
	const getOriginPosition=useCallback(()=>{
		const {left,top,width,height}=iconRef.current.getBoundingClientRect();
		originPositionRef.current.targetLeft=left+'px';
		originPositionRef.current.targetTop=top+'px';
		originPositionRef.current.targetWidth=width+'px';
		originPositionRef.current.targetHeight=height+'px';
	},[]);
	useEffect(()=>{
		getOriginPosition();
		addEventListener('resize',getOriginPosition);
		return ()=>{
			removeEventListener('resize',getOriginPosition);
		};

	},[]);

	const closePanel=useCallback(()=>{
		const {target}=dragResizeRef.current;
		const {top,left,width,height}=getComputedStyle(target);
		const {targetTop,targetLeft,targetHeight,targetWidth}=originPositionRef.current;
		merge(originPositionRef.current,{top,left,width,height});
		target.style.top=targetTop;
		target.style.left=targetLeft;
		target.style.width=targetWidth;
		target.style.height=targetHeight;
		target.style.transition='all 500ms';
		target.style.visibility='hidden';
		isShowRef.current=false;
		setTimeout(()=>{
			iconRef.current.style.display='flex';
		},500);

	},[]);

	const onClick=useCallback((event:React.MouseEvent)=>{
		event.stopPropagation();
		const target=dragResizeRef.current.target;
		if(isShowRef.current){
			closePanel();
		}else {
			const {top,left,width}=originPositionRef.current;
			target.style.visibility='visible';
			target.style.cssText=`top:${top};left:${left};width:${width};transition:top,left,width 500ms;`;
			isShowRef.current=true;
		}
	},[]);

	const onMouseLeave=useCallback((event:React.MouseEvent)=>{
		event.stopPropagation();
		if(isShowRef.current){
			setTimeout(()=>{
				iconRef.current.style.display='none';
			},500);
		}
	},[]);

	return <>
		<Icon icon={icon}
					onMouseLeave={onMouseLeave}
			ref={iconRef}
			onClick={onClick}
			className={styles['icon-Menu']}
			iconClass={styles['icon-class']}/>
		{children}
		</>;
}

export default memo(forwardRef(BarButton));
