import React from 'react';
import styles from '../../index.less';
import each from 'lodash/each';
import { PaneType } from './ObjectArrayComponent';

interface SortComponentPropsType {
  onSortChange: (data: any) => any,
  sortData: any
}

function SortComponent(props: SortComponentPropsType) {

  const { onSortChange, sortData } = props;

  function renderSortItem({ key }: any) {
    return <div
      className={styles['sort-item']}
      id={key}
      key={key}
    >
      {key}
    </div>;
  }


  function onLayoutSortChange(sortKeys = []) {
    const dataMap: { [key: string]: PaneType } = {};
    each(sortData, (data) => {
      dataMap[data.key] = data;
    });
    const nextSortData: PaneType[] = [];
    each(sortKeys, key => nextSortData.push(dataMap[key]));
    onSortChange && onSortChange(nextSortData);
  };

  return (
    // <Sortable
    //   options={{
    //     animation: 200,
    //     dataIdAttr: 'id',
    //     ghostClass: styles['item-background'],
    //     swapThreshold: 0.5,
    //     direction: 'horizontal',
    //     scroll: true,
    //   }}
    //   style={{ display: 'flex', overflow: 'auto', paddingBottom: 10, paddingTop: 1 }}
    //   onChange={onLayoutSortChange}
    // >
    //   {map(sortData, renderSortItem)}
    // </Sortable>
      null
  );
}

export default SortComponent;
