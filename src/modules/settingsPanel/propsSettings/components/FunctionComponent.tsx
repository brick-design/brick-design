import React, { Component } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import split from 'lodash/split'

class FunctionComponent extends Component<InputProps> {

  shouldComponentUpdate(nextProps:InputProps) {
    const { value } = nextProps;
    const { value: prevValue } = this.props;
    return value !== prevValue;
  }

  onFunChange = (e:any) => {
    const { onChange } = this.props;
    const { value } = e.target;
    const result:any=value&&`this.${value}`
    onChange && onChange(result);

  };

  render() {
    const { value, onChange, ...rest } = this.props;
    const resultValue=value&&split(value as string,'.')[1]
    return (<Input onChange={this.onFunChange} value={resultValue} {...rest} />);
  }
}

export default FunctionComponent
