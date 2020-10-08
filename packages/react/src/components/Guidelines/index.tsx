import React, { memo, useEffect, useRef } from 'react';
import {
	PageConfigType,
	DragSourceType,
	DropTargetType,
	SelectedInfoType,
	STATE_PROPS,
} from '@brickd/core';
import { useSelector } from '@brickd/redux-bridge';
import styles from './index.less';
import {
	generateCSS,
	getElementInfo,
	getIframe,
	getIsModalChild,
	getSelectedNode,
	setPosition,
} from '../../utils';

type SelectState = {
	hoverKey: string | null
	dropTarget: DropTargetType | null
	selectedInfo: SelectedInfoType | null
	dragSource: DragSourceType | null
	pageConfig: PageConfigType
}

const controlUpdate = () => {
	return true;
};

function Guidelines() {
	const topRef = useRef<any>();
	const bottomRef = useRef<any>();
	const leftRef = useRef<any>();
	const rightRef = useRef<any>();
	const hoverNodeRef = useRef<any>();
	const {
		hoverKey,
		dropTarget,
		dragSource,
		selectedInfo,
		pageConfig,
	} = useSelector<SelectState, STATE_PROPS>(
		[
			'hoverKey',
			'dropTarget',
			'dragSource',
			'selectedInfo',
			'pageConfig',
		],
		controlUpdate,
	);
	const { domTreeKeys } = selectedInfo || {};
	const isModal = getIsModalChild(pageConfig, domTreeKeys);
	const guidControl =
		hoverKey && (!selectedInfo || (selectedInfo && !dragSource));
	useEffect(() => {
		const iframe = getIframe();
		if(!iframe) return;
		const { contentWindow,contentDocument } = iframe;
		const renderGuideLines = () => {
			const node = getSelectedNode(hoverKey!, iframe);
			if (guidControl && node) {
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
		};
		renderGuideLines();
		const onScroll = () => {
			setTimeout(renderGuideLines, 66);
		};
		contentWindow.addEventListener('scroll', onScroll);
		return () => {
			contentWindow.removeEventListener('scroll', onScroll);
		};
	});

	const guidH = guidControl ? styles['guide-h'] : styles['guide-hidden'];
	const guidV = guidControl ? styles['guide-v'] : styles['guide-hidden'];
	const hoverNode = guidControl
		? dropTarget
			? styles['drop-node']
			: styles['hover-node']
		: styles['guide-hidden'];
	return (
		<>
			<div ref={hoverNodeRef} className={hoverNode} />
			<div ref={leftRef} className={guidV} />
			<div ref={rightRef} className={guidV} />
			<div ref={topRef} className={guidH} />
			<div ref={bottomRef} className={guidH} />
		</>
	);
}

export default memo(Guidelines);
