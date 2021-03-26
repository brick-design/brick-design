import React, { memo } from 'react';
import styles from './index.less';
import configs, { ACTIONS } from './configs';

interface ActionSheetProps {
  isOut: boolean;
  hasChildNodes: boolean;
  isRoot: boolean;
  keyValue?:string
}

function ActionSheet(props: ActionSheetProps) {
  const { isOut, isRoot, hasChildNodes,keyValue } = props;

  return (
    <div className={styles['container']} style={{ top: isOut ? -9 : 0 }}>
      <div className={styles['action-btn']} >
        {keyValue}
      </div>
      {configs.map((config) => {
        const { icon, action, type } = config;
        if (isRoot && type === ACTIONS.copy) return null;
        if (!hasChildNodes && type === ACTIONS.clear) return null;
        return (
          <div className={styles['action-btn']} onClick={action} key={type}>
            <img src={icon} className={styles['action-icon']} />
          </div>
        );
      })}
    </div>
  );
}

export default memo(ActionSheet);
