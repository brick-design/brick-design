import React, { Component } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';

class StringArray extends Component<SelectProps> {

  shouldComponentUpdate(nextProps:SelectProps) {
    const { value } = nextProps;
    const { value: prevValue } = this.props;
    return value !== prevValue;
  }

  render() {
    return <Select
      allowClear
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...this.props}
    />;
  }
}

export default StringArray
