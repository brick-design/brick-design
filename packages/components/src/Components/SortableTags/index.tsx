import React, { forwardRef, memo, Ref, useCallback } from 'react';
import { map } from 'lodash';
import styles from './index.less';
import { ReactSortable } from '../index';
import { SortableProps } from '../ReactSortable';

interface SortItemProps {
  value: string;
  onDeleteItem?: (key: string) => void;
  onTagClick?: (key: string) => void;
}
function SortItem(props: SortItemProps) {
  const { value, onDeleteItem } = props;
  const onClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteItem(value);
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

  const onSortData = (sortKeys: string[]) => {
    const index = sortKeys.indexOf('extra-item');
    sortKeys.splice(index, 1);
    onSortChange && onSortChange(sortKeys);
  };

  const onDelete = useCallback(
    (value: string) => {
      onDeleteItem && onDeleteItem(value);
      const index = sortData.findIndex((data) => data === value);
      sortData.splice(index, 1);
      onSortChange && onSortChange(sortData);
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
      {map(sortData, (item) => (
        <SortItem onDeleteItem={onDelete} value={item} key={item} />
      ))}
      {!!extra && extra}
    </ReactSortable>
  );
}

export default memo(forwardRef(SortableTags));
