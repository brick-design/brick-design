import React, { memo, useState } from 'react';
import styles from './index.less';
import listIcon from '../../assets/list-icon.svg';
import prevIcon from '../../assets/prev-icon.svg';

interface CheckboxProps {
  onChange?: (v: boolean) => void;
  uncheckedIcon?: string;
  checkedIcon?: string;
  className?:string
  iconClass?:string
}

function Checkbox(props: CheckboxProps) {
  const { uncheckedIcon = listIcon, checkedIcon = prevIcon, onChange,iconClass,...rest } = props;
  const [isChecked, setIsChecked] = useState(false);

  const changeChecked = () => {
    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };
  return (
    <div onClick={changeChecked} className={styles['checkbox-container']} {...rest} >
      <img
        src={isChecked ? checkedIcon : uncheckedIcon}
        className={`${styles['icon']} ${iconClass}`}
      />
    </div>
  );
}

export default memo(Checkbox);
