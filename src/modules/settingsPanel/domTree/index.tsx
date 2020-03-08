import React, { useCallback } from 'react';
import { reduxConnect } from '@/utils';
import SortTree from './SortTree';
import styles from './index.less';
import { ACTION_TYPES } from '@/models';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { Dispatch } from 'redux';

interface DomTreePropsType {
  componentConfigs?: VirtualDOMType[],
  selectedComponentInfo?: SelectedComponentInfoType,
  hoverKey?: string,
  dispatch?: Dispatch
}


function DomTree(props: DomTreePropsType) {

  const { dispatch, componentConfigs, selectedComponentInfo, hoverKey } = props;

  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    dispatch!({
      type: ACTION_TYPES.clearHovered,
    });
  }, []);

  return (
    <div className={styles['sort-container']}>
      <div onMouseLeave={onMouseLeave} style={{ width: '100%' }}>
        <SortTree disabled
                  dispatch={dispatch}
                  childNodes={componentConfigs}
                  selectedComponentInfo={selectedComponentInfo}
                  hoverKey={hoverKey}
        />
      </div>
    </div>
  );
}

export default reduxConnect(['componentConfigs', 'selectedComponentInfo', 'hoverKey'])(DomTree);
