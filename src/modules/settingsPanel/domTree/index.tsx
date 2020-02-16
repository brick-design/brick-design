import React, { Component } from 'react';
import { reduxConnect } from '@/utils';
import SortTree from './SortTree';
import styles from './index.less';
import {ACTION_TYPES} from '@/models';
import { VirtualDOMType } from '@/types/ModelType';
import {Dispatch} from 'redux'

interface DomTreePropsType {
  componentConfigs?:VirtualDOMType[],
  dispatch?:Dispatch
}
@reduxConnect(['componentConfigs'])
class DomTree extends Component<DomTreePropsType> {


  onMouseLeave = (e:any) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch!({
      type: ACTION_TYPES.clearHovered,
    });
  };

  render() {
    const { componentConfigs, dispatch } = this.props;
    return (
      <div className={styles['sort-container']}>
        <div onMouseLeave={this.onMouseLeave} style={{ width: '100%' }}>
          <SortTree disabled
                    dispatch={dispatch}
                    childNodes={componentConfigs}
          />
        </div>
      </div>
    );
  }
}

export default DomTree
