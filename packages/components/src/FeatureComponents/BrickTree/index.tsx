import React, { memo, useCallback } from 'react';
import {
  useSelector,
  PageConfigType,
  ROOT,
  STATE_PROPS,
  useOperate,
} from '@brickd/canvas';
import SortTree from './SortTree';
import styles from './index.less';

function BrickTree() {
  const { pageConfig } = useSelector<
    { pageConfig: PageConfigType },
    STATE_PROPS
  >(['pageConfig'], (prevState, nextState) => {
    const { pageConfig } = nextState;
    return !!(!prevState.pageConfig[ROOT] && pageConfig[ROOT]);
  });
  const { setOperateState } = useOperate();

  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    setOperateState({ operateHoverKey: null, hoverNode: null });
  }, []);

  if (!pageConfig[ROOT]) return null;
  return (
    <div
      onMouseLeave={onMouseLeave}
      onWheel={(event) => event.stopPropagation()}
      className={styles['sort-container']}
    >
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
