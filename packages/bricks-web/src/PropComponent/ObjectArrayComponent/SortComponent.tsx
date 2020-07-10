import React from 'react';
import styles from '../../index.less';
import each from 'lodash/each';
import map from 'lodash/map';
import { PaneType } from './ObjectArrayComponent';
import { ReactSortable } from 'brickd';

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
    <ReactSortable
      options={{
        animation: 200,
        dataIdAttr: 'id',
        ghostClass: styles['item-background'],
        swapThreshold: 0.5,
        direction: 'horizontal',
        scroll: true,
      }}
      style={{ display: 'flex', overflow: 'auto', paddingBottom: 10, paddingTop: 1 }}
      onChange={onLayoutSortChange}
    >
      {map(sortData, renderSortItem)}
    </ReactSortable>
  );
}

export default SortComponent;
