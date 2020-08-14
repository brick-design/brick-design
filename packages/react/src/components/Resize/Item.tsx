import React from 'react';
import styles from './index.less';
import { Direction } from './index';

interface ItemProps {
	onResizeStart: (
		e: React.MouseEvent<HTMLSpanElement>,
		direction: Direction,
	) => void
	direction: Direction
}

const positionStyles: { [key: string]: React.CSSProperties } = {
	top: {
		top: '-4px',
		cursor: 'row-resize',
	},
	right: {
		right: '-4px',
		cursor: 'col-resize',
	},
	bottom: {
		bottom: '-4px',
		cursor: 'row-resize',
	},
	left: {
		left: '-4px',
		cursor: 'col-resize',
	},
	topRight: {
		right: '-4px',
		top: '-4px',
		cursor: 'ne-resize',
	},
	bottomRight: {
		right: '-4px',
		bottom: '-4px',
		cursor: 'se-resize',
	},
	bottomLeft: {
		left: '-4px',
		bottom: '-4px',
		cursor: 'sw-resize',
	},
	topLeft: {
		left: '-4px',
		top: '-4px',
		cursor: 'nw-resize',
	},
};

export function Item(props: ItemProps) {
	const { onResizeStart, direction } = props;
	return (
		<span
			style={positionStyles[direction]}
			onMouseDown={(e) => onResizeStart(e, direction)}
			className={styles['resize-item']}
		/>
	);
}
