import React, { createElement, memo, useContext, useRef } from 'react';
import { get } from 'lodash';
import {getBrickdConfig, setDragSource } from '@brickd/canvas';
import styles from './index.less';
import { SearchContext } from '../Components/SearchBar';

interface DragAbleItemPropsType {
  dragSource: {
    defaultProps?: any;
    componentName: string;
  };
  img?: string;
  desc?: string;
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
    img,
    desc,
  } = props;

  const isChecked = useContext(SearchContext);

  const randomIndex: number = useRef(Math.floor(Math.random() * 10)).current;

  function renderDragComponent() {
    if (!defaultProps) {
      return (
        <div
          style={{ backgroundColor: defaultColors[randomIndex] }}
          className={styles['placeholder-item']}
        >
          {img?<img className={styles['item-img']} alt='' src={img} />:componentName}
        </div>
      );
    };
    return createElement(
      get(getBrickdConfig().componentsMap, componentName, componentName),
      defaultProps,
    );
  }

  return (
    <div
      className={
        isChecked ? styles['list-container'] : styles['drag-container']
      }
    >
      <div className={styles['list-drag-container']}>
        <div
          draggable
          onDragStart={(event: React.DragEvent) => {
            event.stopPropagation();
            setDragSource(dragSource);
          }}
          className={styles['item']}
        >
          {renderDragComponent()}
        </div>
      </div>
      <span className={`${styles['hidden-drag-name']} ${styles['drag-name']}`}>
        {desc || componentName}
      </span>
    </div>
  );
};

export default memo(DragAbleItem, () => true);
