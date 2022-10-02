import React, { forwardRef, memo, Ref, useCallback } from 'react';
import { map } from 'lodash';
import styles from './index.less';
import { ReactSortable } from '../index';
import { SortableProps } from '../ReactSortable';

interface SortItemProps {
  value: string;
  onDeleteItem?: (key: string,index:number) => void;
  onTagClick?: (key: string) => void;
  index:number
}
function SortItem(props: SortItemProps) {
  const { value, onDeleteItem ,index} = props;
  const onClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteItem(value,index);
  }, []);

  return (
    <div className={styles['sort-item']} id={value}>
      {value}
      <span className={styles['close']} onClick={onClick}>
        x
      </span>
    </div>
  );
}

interface SortableTagsProps extends SortableProps, SortItemProps {
  className?: string;
  sortData: any[];
  onSortChange: (sortData: any[]) => void;
  extra?: any;
}

function SortableTags(props: SortableTagsProps, ref: Ref<HTMLDivElement>) {
  const {
    sortData,
    onSortChange,
    className,
    extra,
    onDeleteItem,
    ...rest
  } = props;
  console.log('sortData1>>>>>>>',sortData);
  const onSortData = (sortKeys: string[]) => {
    const index = sortKeys.indexOf('extra-item');
    console.log('onSortData>>>>>>>',sortKeys);

    sortKeys.splice(index, 1);
    onSortChange && onSortChange(sortKeys);
  };

  const onDelete = useCallback(
    (value: string,index:number) => {
      onDeleteItem && onDeleteItem(value,index);
      let newSortData=[...sortData];
      if(newSortData.length>1){
        newSortData.splice(index, 1);
      }else {
        newSortData=undefined;
      }
      console.log('newSortData>>>>>>',newSortData);

      onSortChange && onSortChange(newSortData);
    },
    [sortData],
  );

  return (
    <ReactSortable
      ref={ref}
      className={`${styles['container']} ${className}`}
      options={{
        group: { name: 'nested' },
        animation: 200,
        dataIdAttr: 'id',
        ghostClass: styles['item-background'],
        swapThreshold: 0.5,
      }}
      onChange={onSortData}
      {...rest}
    >
      {map(sortData, (item,index) => {
        return <SortItem onDeleteItem={onDelete} value={item} index={index} key={`${item}-${index}`} />;
      })}
      {!!extra && extra}
    </ReactSortable>
  );
}

export default memo(forwardRef(SortableTags));
