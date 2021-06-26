import React, { memo, useCallback } from 'react';
import {
  useSelector,
  clearHovered,
  PageConfigType,
  ROOT,
  STATE_PROPS,
} from '@brickd/canvas';
import SortTree from './SortTree';
import styles from './index.less';


function BrickTree() {
  const { pageConfig } = useSelector<
    { pageConfig: PageConfigType },
    STATE_PROPS
  >(['pageConfig'], (prevState, nextState) => {
    const { pageConfig} = nextState;
    return !!(!prevState.pageConfig[ROOT] && pageConfig[ROOT]);
  });
  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    clearHovered();
  }, []);

  if (!pageConfig[ROOT]) return null;
  return (
    <div onMouseLeave={onMouseLeave} className={styles['sort-container']}>
      <SortTree
        disabled
        childNodes={[ROOT]}
        specialProps={{ key: ROOT, domTreeKeys: [], parentKey: '' }}
        componentName={''}
      />
    </div>
  );
}

export default memo(BrickTree);
