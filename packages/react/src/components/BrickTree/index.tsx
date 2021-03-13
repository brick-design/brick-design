import React, { memo, useCallback } from 'react';
import { clearHovered, PageConfigType, ROOT, STATE_PROPS } from '@brickd/core';
import SortTree from './SortTree';
import styles from './index.less';
import { useSelector } from '../../hooks/useSelector';

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
  const { className } = props;
  return (
    <div
      onMouseLeave={onMouseLeave}
      className={`${styles['sort-container']} ${className}`}
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
