import React, { createElement, memo, useContext, useRef } from 'react';
import get from 'lodash/get';
import { getDragSource, getBrickdConfig } from '@brickd/react';
import styles from './index.less';
import { PreviewContext } from './PreviewContext';

interface DragAbleItemPropsType {
  dragSource: {
    defaultProps?: any;
    componentName: string;
  };
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

  const isChecked = useContext(PreviewContext);

  const randomIndex: number = useRef(Math.floor(Math.random() * 10)).current;

  function renderDragComponent() {
    if (!defaultProps) {
      return (
        <div
          style={{ backgroundColor: defaultColors[randomIndex] }}
          className={styles['placeholder-item']}
        >
          {componentName}
        </div>
      );
    }
    return createElement(
      get(getBrickdConfig().componentsMap, componentName, componentName),
      defaultProps,
    );
  }
  if (isChecked) {
    return (
      <div className={styles['list-container']}>
        <div className={styles['list-drag-container']}>
          <div
            draggable
            onDragStart={() => getDragSource(dragSource)}
            className={styles['item']}
          >
            {renderDragComponent()}
          </div>
        </div>
        <span className={styles['drag-name']}>{componentName}</span>
      </div>
    );
  }

  return (
    <div data-name={componentName} className={styles['drag-container']}>
      <div
        draggable
        onDragStart={() => getDragSource(dragSource)}
        className={styles['item']}
      >
        {renderDragComponent()}
      </div>
    </div>
  );
}

export default memo(DragAbleItem, () => true);
