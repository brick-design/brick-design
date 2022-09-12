import React, { memo } from 'react';
import { map } from 'lodash';
import styles from './index.less';

interface RadioType {
  onChange?: (value: any) => void;
  targetValue?: string;
  value?: string;
  selectedStyle?: React.CSSProperties;
  unselectedStyle?: React.CSSProperties;
  isFirst?: boolean;
  isLast?: boolean;
}
function Radio(props: RadioType) {
  const {
    onChange,
    targetValue,
    value,
    selectedStyle,
    unselectedStyle,
    isFirst,
    isLast,
    ...rest
  } = props;
  const isSelected = targetValue === value;

  const onClick = () => {
    onChange && onChange(!value||!isSelected ? targetValue : undefined);
  };
  return (
    <span
      onClick={onClick}
      className={`${styles['radio-item']} 
							 ${isFirst && styles['isFirst']} 
							 ${isLast && styles['isLast']}
							 ${isSelected && styles['isSelected']}
							 `}
      style={isSelected ? selectedStyle : unselectedStyle}
      {...rest}
    >
      {targetValue}
    </span>
  );
}

interface RadioGroupProp extends RadioType {
  radioData: string[];
  className?: string;
}

function RadioGroup(props: RadioGroupProp) {
  const { radioData, className, ...rest } = props;
  console.log('RadioGroup>>>>>>>',rest);
  return (
    <div className={`${styles['radio-group']} ${className}`}>
      {map(radioData, (v, index) => {
        return (
          <Radio
            targetValue={v}
            isFirst={index === 0}
            isLast={radioData.length - 1 === index}
            {...rest}
            key={v}
          />
        );
      })}
    </div>
  );
}
export default memo(RadioGroup);
