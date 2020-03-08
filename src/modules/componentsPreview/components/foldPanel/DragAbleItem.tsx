import React, { createElement, memo, useRef } from 'react';
import config from '@/configs';
import styles from '../index.less';
import get from 'lodash/get';
import { ACTION_TYPES } from '@/models';
import { Dispatch } from 'redux';

interface DragAbleItemPropsType {
  dispatch: Dispatch,
  item: {
    defaultProps: any,
    componentName: string
  },
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
    item, dispatch, item: { defaultProps, componentName },
  } = props;
  const randomIndex: number = useRef(Math.floor(Math.random() * 10)).current;

  function renderDragComponent() {
    if (!defaultProps) {
      return componentName;
    }
    return createElement(get(config.OriginalComponents, componentName, componentName), defaultProps);
  }

  // 没有设置默认属性说明组件无法展示，设置背景色
  const style = !defaultProps ? {
    backgroundColor: defaultColors[randomIndex],
    border: 0,
  } : undefined;
  return (<div draggable
               onDragStart={() => dispatch({
                 type: ACTION_TYPES.getDragData,
                 payload: {
                   dragData: item,
                 },
               })}
               className={styles.item}
               style={style}
  >
    {renderDragComponent()}
  </div>);
}

export default memo(DragAbleItem, () => true);
