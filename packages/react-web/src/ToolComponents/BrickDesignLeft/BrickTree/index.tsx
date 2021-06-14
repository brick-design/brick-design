import React, { memo, useCallback } from 'react';
import { useSelector,clearHovered, PageConfigType, ROOT, STATE_PROPS } from '@brickd/react';
import SortTree from './SortTree';
import styles from './index.less';

interface BrickTreeProps {
  className?: string;
}

function BrickTree(props: BrickTreeProps) {
  const { pageConfig } = useSelector<
    { pageConfig: PageConfigType },
    STATE_PROPS
  >(['pageConfig'], (prevState, nextState) => {
    const {
      pageConfig: { [ROOT]: prevRoot },
    } = prevState;
    const {
      pageConfig: { [ROOT]: root },
    } = nextState;
    return !!(!prevRoot && root);
  });
  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation();
    clearHovered();
  }, []);

  if (!pageConfig[ROOT]) return null;
  return (
    <div
      onMouseLeave={onMouseLeave}
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
