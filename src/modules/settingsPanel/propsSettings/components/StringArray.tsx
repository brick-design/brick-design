import React, { memo } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { propsAreEqual } from '@/utils';

const StringArray=(props:SelectProps)=> {
    return <Select
      allowClear
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...props}
    />;
  }

export default memo(StringArray,propsAreEqual)
