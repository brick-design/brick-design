import React, { memo, useEffect, useRef } from 'react';
import {
	DragSourceType,
	DropTargetType,
	SelectedInfoType,
	STATE_PROPS,
} from '@brickd/core';
import {get} from 'lodash';
import styles from './index.less';
import { useSelector } from '../../hooks/useSelector';
import {
	generateCSS,
	getElementInfo,
	getIframe,
	getSelectedNode,
	setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { OperateStateType } from '../OperateProvider';

type SelectState = {
	hoverKey: string | null
	dropTarget: DropTargetType | null
	selectedInfo: SelectedInfoType | null
	dragSource: DragSourceType | null
}

function Guidelines() {
	const topRef = useRef<any>();
	const bottomRef = useRef<any>();
	const leftRef = useRef<any>();
	const rightRef = useRef<any>();
	const hoverNodeRef = useRef<any>();

	const {
		hoverKey:selectHoverKey,
		dropTarget,
		selectedInfo} = useSelector<SelectState, STATE_PROPS>(
		[
			'hoverKey',
			'dropTarget',
			'selectedInfo',
		]);

	const {getOperateState,setSubscribe,setOperateState}=useOperate();
	const { selectedKey } = selectedInfo || {};
	const dropKey=get(dropTarget,'selectedKey');
	const hoverKey=dropKey ||selectHoverKey;
	const {operateHoverKey,operateSelectedKey}=getOperateState<OperateStateType>();

		if(selectHoverKey!==operateHoverKey){
			const hoverNode = getSelectedNode(hoverKey, getIframe());
			setOperateState({hoverNode,operateHoverKey:selectHoverKey});
		}

		if(selectedKey!==operateSelectedKey){
			const selectedNode = getSelectedNode(selectedKey, getIframe());
			setOperateState({selectedNode,operateSelectedKey:selectedKey});
		}


	const guidControl = hoverKey && (!selectedInfo ||selectedKey&&selectedKey!==dropKey);



	useEffect(() => {
		const iframe = getIframe();
		const { contentWindow,contentDocument } = iframe;
		const renderGuideLines = () => {
			const {hoverNode,dropNode,isModal}=getOperateState<OperateStateType>();
			const node=dropNode||hoverNode;
			if (node) {
				const { left, top, bottom, right, width, height } = getElementInfo(
					node,
					iframe,
					isModal,
				);
				hoverNodeRef.current.style.cssText = generateCSS(
					left,
					top,
					width,
					height,
				);
				topRef.current.style.top = `${top}px`;
				topRef.current.style.width = `${contentDocument!.body.scrollWidth}px`;
				leftRef.current.style.left = `${left}px`;
				leftRef.current.style.height = `${contentDocument!.body.scrollHeight}px`;
				rightRef.current.style.left = `${right - 1}px`;
				rightRef.current.style.height = `${
					contentDocument!.body.scrollHeight
				}px`;
				bottomRef.current.style.top = `${bottom - 1}px`;
				bottomRef.current.style.width = `${contentDocument!.body.scrollWidth}px`;
				setPosition(
					[
						hoverNodeRef.current,
						leftRef.current,
						rightRef.current,
						topRef.current,
						bottomRef.current,
					],
					isModal,
				);
			}
			if(dropNode){
				setTimeout(renderGuideLines,100);
			}
		};
		const unSubscribe= setSubscribe(renderGuideLines);
		const onScroll = () => {
			setTimeout(renderGuideLines, 66);
		};
		contentWindow.addEventListener('scroll', onScroll);
		return () => {
			unSubscribe();
			contentWindow.removeEventListener('scroll', onScroll);
		};

	},[hoverNodeRef.current,leftRef.current,rightRef.current,bottomRef.current,topRef.current]);

	const guidH = guidControl ? styles['guide-h'] : styles['guide-hidden'];
	const guidV = guidControl ? styles['guide-v'] : styles['guide-hidden'];
	const hoverNodeClass = guidControl
		? dropTarget
			? styles['drop-node']
			: styles['hover-node']
		: styles['guide-hidden'];
	return (
		<>
			<div ref={hoverNodeRef} className={hoverNodeClass} />
			<div ref={leftRef} className={guidV} />
			<div ref={rightRef} className={guidV} />
			<div ref={topRef} className={guidH} />
			<div ref={bottomRef} className={guidH} />
		</>
	);
}

export default memo(Guidelines);
