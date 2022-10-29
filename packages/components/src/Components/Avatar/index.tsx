import React, { memo } from 'react';
import styles from './index.less';

interface Avatar extends React.HtmlHTMLAttributes<HTMLDivElement> {
  icon?: string;
  iconClass?: string;
}
function Avatar(props: Avatar) {
  const { icon, iconClass, ...rest } = props;
  return (
    <div {...rest}>
      <img
        src={icon}
        className={`${styles['avatar-icon']} ${iconClass}`}
        alt={''}
      />
    </div>
  );
}

export default memo(Avatar);
