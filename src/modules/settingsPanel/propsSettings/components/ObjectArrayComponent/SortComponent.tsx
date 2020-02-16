import React, { PureComponent } from 'react';
import styles from '../../index.less';
import map from 'lodash/map';
import each from 'lodash/each';
import { Sortable } from '@/components';
import { PaneType } from '@/modules/settingsPanel/propsSettings/components/ObjectArrayComponent/ObjectArrayComponent';
interface SortComponentPropsType {
  onSortChange:(data:any)=>any,
  sortData:any
}
export default class SortComponent extends PureComponent<SortComponentPropsType> {

  renderSortItem = ({ key }:any) => {
    return <div
      className={styles['sort-item']}
      data-sortkey={key}
      key={key}
    >
      {key}
    </div>;
  };


  onLayoutSortChange = (sortKeys = []) => {
    const { onSortChange, sortData } = this.props;
    const dataMap:{[key:string]:PaneType} = {};
    each(sortData, (data) => {
      dataMap[data.key] = data;
    });
    const nextSortData:PaneType[] = [];
    each(sortKeys, key => nextSortData.push(dataMap[key]));
    onSortChange && onSortChange(nextSortData);
  };

  render() {
    const { sortData } = this.props;
    return (
      <Sortable
        options={{
          animation: 200,
          dataIdAttr: 'sortkey',
          ghostClass: styles['item-background'],
          swapThreshold: 0.5,
          direction: 'horizontal',
          scroll: true,
        }}
        style={{ display: 'flex', overflow: 'auto', paddingBottom: 10, paddingTop: 1 }}
        onChange={this.onLayoutSortChange}
      >
        {map(sortData, this.renderSortItem)}
      </Sortable>
    );
  }
}
