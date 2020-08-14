import React, { createElement, memo, useRef } from 'react';
import get from 'lodash/get';
import { getDragSource, LEGO_BRIDGE } from '@brickd/react';
import styles from './index.less';

interface DragAbleItemPropsType {
	dragSource: {
		defaultProps: any
		componentName: string
	}
}

const defaultColors = [
	'#5237D8',
	'#46BD6F',
	'#AF4A86',
	'#FF8C00',
	'#EE3A8C',
	'#8470FF',
	'#FFD700',
	'#7D26CD',
	'#7FFFD4',
	'#008B8B',
];

/**
 * 拖拽组件
 * 组件拖拽时会将其携带的组件名称传入 store
 * @param props
 * @constructor
 */
function DragAbleItem(props: DragAbleItemPropsType) {
	const {
		dragSource,
		dragSource: { defaultProps, componentName },
	} = props;
	const randomIndex: number = useRef(Math.floor(Math.random() * 10)).current;

	function renderDragComponent() {
		if (!defaultProps) {
			return componentName;
		}
		return createElement(
			get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName),
			defaultProps,
		);
	}

	// 没有设置默认属性说明组件无法展示，设置背景色
	const style = !defaultProps
		? {
				backgroundColor: defaultColors[randomIndex],
				border: 0,
		  }
		: undefined;
	return (
		<div
			draggable
			onDragStart={() => getDragSource(dragSource)}
			className={styles.item}
			style={style}
		>
			{renderDragComponent()}
		</div>
	);
}

export default memo(DragAbleItem, () => true);
