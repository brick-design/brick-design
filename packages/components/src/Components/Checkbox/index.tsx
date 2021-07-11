import React, { memo, useState } from 'react';
import styles from './index.less';
import listIcon from '../../assets/list-icon.svg';
import prevIcon from '../../assets/prev-icon.svg';

interface CheckboxProps extends React.HTMLProps<HTMLDivElement>{
  onChange?: (v: any) => void;
  uncheckedIcon?: string;
  checkedIcon?: string;
  iconClass?:string
}

function Checkbox(props: CheckboxProps) {
  const { uncheckedIcon = listIcon, checkedIcon = prevIcon, onChange,iconClass,className,...rest } = props;
  const [isChecked, setIsChecked] = useState(false);

  const changeChecked = () => {
    setIsChecked(!isChecked);
    onChange && onChange(!isChecked);
  };
  return (
    <div onClick={changeChecked} className={`${styles['checkbox-container']} ${className}`} {...rest} >
      <img
        src={isChecked ? checkedIcon : uncheckedIcon}
        className={`${styles['icon']} ${iconClass}`}
      />
    </div>
  );
}

export default memo(Checkbox);
