import React, { memo } from 'react';
import styles from './index.less';
import Icon from '../Icon';

interface TipsProps {
  cancelText?: string;
  cancelCallBack?: () => void;
  confirmText?: string;
  visible?: boolean;
  confirmCallBack?: () => void;
  tip: string;
  tipTitle: string;
  icon: string;
}
function Tips(props: TipsProps) {
  const {
    icon,
    tipTitle,
    tip,
    confirmText,
    cancelText,
    cancelCallBack,
    confirmCallBack,
    visible,
  } = props;
  return (
    <div
      style={{ display: visible ? 'flex' : 'none' }}
      className={styles['container']}
    >
      <div className={styles['title-container']}>
        <Icon iconClass={styles['icon']} icon={icon} />
        <span className={styles['title']}>{tipTitle}</span>
      </div>
      <span className={styles['content']}>{tip}</span>
      <div className={styles['btn-container']}>
        {cancelText && (
          <button className={styles['btn-cancel']} onClick={cancelCallBack}>
            {cancelText}
          </button>
        )}
        {confirmText && (
          <button className={styles['btn-confirm']} onClick={confirmCallBack}>
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(Tips);
