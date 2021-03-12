import React, { forwardRef, memo } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import split from 'lodash/split';
import { propsAreEqual } from '../utils';

function FunctionComponent(props: InputProps, ref: any) {
  const { value, onChange, ...rest } = props;
  const resultValue = value && split(value as string, '.')[1];
  return (
    <Input
      ref={ref}
      onChange={(e: any) => {
        const { value } = e.target;
        const result: any = value && `this.${value}`;
        onChange && onChange(result);
      }}
      value={resultValue}
      allowClear
      {...rest}
    />
  );
}

export default memo(forwardRef(FunctionComponent), propsAreEqual);
