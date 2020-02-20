import React, { memo,forwardRef } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { propsAreEqual } from '@/utils';

const StringArray=forwardRef((props:SelectProps,ref:any)=> {
    return <Select
      ref={ref}
      allowClear
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...props}
    />;
  })

export default memo(StringArray,propsAreEqual)
