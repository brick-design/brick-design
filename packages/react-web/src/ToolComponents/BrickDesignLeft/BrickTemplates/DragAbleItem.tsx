import React, { memo, useContext } from 'react';
import { getDragSource, PageConfigType } from '@brickd/react';
import styles from './index.less';
import { SearchContext } from '../Components/SearchBar';

interface DragAbleItemPropsType {
  item: TemplateType;
}

export interface TemplateType {
  img?: string;
  vDOMCollection: PageConfigType;
  desc?: string;
  id?: string;
}
/**
 * 拖拽组件
 * 组件拖拽时会将其携带的组件名称传入 store
 * @param props
 * @constructor
 */
function DragAbleItem(props: DragAbleItemPropsType) {
  const { item } = props;
  const { vDOMCollection, img, desc } = item;
  const isChecked = useContext(SearchContext);
  return (
    <div
      className={
        isChecked ? styles['list-container'] : styles['drag-container']
      }
    >
      <div className={styles['list-drag-container']}>
        <div
          draggable
          onDragStart={() => getDragSource({ vDOMCollection })}
          className={styles['item']}
        >
          <img src={img} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <span className={`${styles['hidden-drag-name']} ${styles['drag-name']}`}>
        {desc}
      </span>
    </div>
  );
}

export default memo(DragAbleItem, () => true);
