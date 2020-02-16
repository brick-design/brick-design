import React, { Component } from 'react';
import { Select } from 'antd';
import isEqual from 'lodash/isEqual'
import { SelectProps } from 'antd/es/select';

interface NumberArrayPropsType extends SelectProps<any>{
  maxTagCount:number,
  onChange:(value:any)=>void
}


class NumberArray extends Component<NumberArrayPropsType> {

  shouldComponentUpdate(nextProps: Readonly<NumberArrayPropsType>){
    const {value}=nextProps
    const {value:prevValue}=this.props
    return isEqual(value,prevValue)
  }

  onNumberChange = (value:string) => {
    const { onChange, maxTagCount = 10000 } = this.props;
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
  };

  render() {
    return (<Select
      mode="tags"
      style={{ width: '100%' }}
      dropdownStyle={{ display: 'none' }}
      {...this.props}
      onChange={this.onNumberChange}
    />);
  }
}

export default NumberArray
