import React, { memo, RefObject, useCallback, useEffect, useState } from 'react';
import { getIframe, useZoom } from '@brickd/canvas';
import styles from './index.less';
import Layers from '../Layers';
import { Checkbox, Icon } from '../../Components';
import { downloadIcon, dragIcon, uploadIcon } from '../../assets';

interface TopLeftButtonsProp{
	dragTarget:RefObject<HTMLDivElement>
}
function TopLeftButtons(props:TopLeftButtonsProp){
	const {dragTarget}=props;
	const [isDragMove,setIsDragMove]=useState<boolean>();
	const {getZoomState,setZoomState}=useZoom();
	const wheelEvent= useCallback((e:WheelEvent,isGlobal?:boolean)=> {
		const {deltaX,deltaY}=e;
		const {scale}=getZoomState();
		if (e.ctrlKey) {
			e.preventDefault();
			setZoomState({scale:scale-deltaY*0.005});
			return  false;
		} else if(isDragMove||isGlobal) {
			e.preventDefault();
			const target=dragTarget.current;
			const {top,left}=getComputedStyle(target);
			target.style.transition='none';
			target.style.left=Number.parseInt(left)-deltaX*2+'px';
			target.style.top=Number.parseInt(top)-deltaY*2+'px';
			return  false;
		}
		return  e;
	},[isDragMove]);

	useEffect(()=>{
		const { contentWindow } = getIframe() || {};
		const globalWheelEvent=(e:WheelEvent)=>{
			wheelEvent(e,true);
			return false;
		};
		addEventListener('wheel',globalWheelEvent,{ passive: false });
		contentWindow.addEventListener('wheel', wheelEvent,{ passive: false });
		return ()=>{
			contentWindow.removeEventListener('wheel', wheelEvent);
			removeEventListener('wheel',globalWheelEvent);
		};
	},[wheelEvent]);


	return(<div className={styles['top-left-bar']}>
		<Layers/>
		<Icon icon={uploadIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>
		<Icon icon={downloadIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>
		<Checkbox onChange={setIsDragMove} checkedIcon={dragIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>
	</div>);
}

export default memo(TopLeftButtons);
