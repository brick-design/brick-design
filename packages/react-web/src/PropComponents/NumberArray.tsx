import React, { forwardRef, memo } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { propsAreEqual } from '../utils';

interface NumberArrayPropsType extends SelectProps<any> {
  maxTagCount: number;
  onChange: (value: any) => void;
}

function NumberArray(props: NumberArrayPropsType, ref: any) {
  function onNumberChange(value: string) {
    const { onChange, maxTagCount = 10000 } = props;
    const numberArray = [];
    if (value.length <= maxTagCount) {
      for (const v of value) {
        if (Number.isNaN(Number.parseFloat(v))) {
          break;
        }
        numberArray.push(Number.parseFloat(v));
      }
      onChange && onChange(numberArray);
    }
  }

  return (
    <Select
      ref={ref}
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...props}
      onChange={onNumberChange}
    />
  );
}

export default memo(forwardRef(NumberArray), propsAreEqual);
