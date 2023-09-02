import React, { useEffect, useRef } from 'react';
import { SelectedInfoType, STATE_PROPS, useSelector,useOperate, getIframe } from '@brickd/canvas';
import styles from './index.less';
import DragAndResize, { DragAndResizeRefType } from '../../Components/DragAndResize';

type PropsHookState = {
	selectedInfo: SelectedInfoType;
};
export default function Menus(){
	const { selectedInfo } = useSelector<PropsHookState, STATE_PROPS>(['selectedInfo']);
	const{getOperateState}= useOperate();
	const dragResizeRef=useRef<DragAndResizeRefType>();
	const {selectedKey}=selectedInfo||{};
	useEffect(()=>{
		const { contentWindow } = getIframe() || {};
		if(contentWindow){
			contentWindow.oncontextmenu=(e)=>{
				e.preventDefault();
				const {selectedNode}=getOperateState();
				if(selectedNode){
					const {clientX,clientY}=e;
					dragResizeRef.current.target.style.cssText = `top:${clientY}px;left:${clientX}px;visibility:visible;transition:all 500ms;`;

				}
			};
		}

	},[]);

	return <DragAndResize
		title={selectedKey}
		className={styles['menu-container']}
		style={{visibility:'hidden'}}
		ref={dragResizeRef}

	>
		<div>

		</div>
	</DragAndResize>;
}
