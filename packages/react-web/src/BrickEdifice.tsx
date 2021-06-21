import React, { memo, useEffect } from 'react';
import styles from './index.less';
import ToolBar from './ToolComponents/ToolBar';
import {
  BrickDesignCanvas,
  BrickDesignCanvasType,
  BrickProvider,
  initPageBrickdState,
  PageBrickdStateType,
} from '@brickd/react';
import BrickDesignLeft from './ToolComponents/BrickDesignLeft';
import { BrickPreviewPropsType } from './ToolComponents/BrickDesignLeft/BrickPreview';
import BrickDesignRight from './ToolComponents/BrickDesignRight';

require('rc-tabs/assets/index.css');
require('rc-collapse/assets/index.css');

interface BrickEdificeProps
  extends BrickDesignCanvasType,
    BrickPreviewPropsType {
  initBrickdState?: PageBrickdStateType;
}
function BrickEdifice(props: BrickEdificeProps) {
  const {
    componentsCategory,
    config,
    warn,
    customReducer,
    initBrickdState,
    ...rest
  } = props;

  useEffect(() => {
    initBrickdState && initPageBrickdState(initBrickdState);
  }, []);

  return (
    <BrickProvider config={config} warn={warn} customReducer={customReducer}>
      <div className={styles['brickd-container']}>
        <ToolBar />
        <BrickDesignCanvas className={styles['brickd-canvas']} {...rest}>
          <BrickDesignLeft componentsCategory={componentsCategory} />
          <BrickDesignRight />
        </BrickDesignCanvas>
      </div>
    </BrickProvider>
  );
}

export default memo(BrickEdifice);
