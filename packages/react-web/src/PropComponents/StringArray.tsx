import React, { forwardRef, memo } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { propsAreEqual } from '../utils';

function StringArray(props: SelectProps, ref: any) {
  return (
    <Select
      ref={ref}
      allowClear
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...props}
    />
  );
}

export default memo(forwardRef(StringArray), propsAreEqual);
