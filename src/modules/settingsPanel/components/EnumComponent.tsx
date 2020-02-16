import React, { Component } from 'react';
import { Select, Tooltip } from 'antd';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import styles from './index.less';
import { SelectProps } from 'antd/lib/select';

const { Option } = Select;
interface EnumComponentPropsType extends SelectProps{
  enumData:string[]|{key:string,label:string},
  onChange:(value:any)=>void
}

class EnumComponent extends Component<EnumComponentPropsType> {
  shouldComponentUpdate(nextProps: Readonly<EnumComponentPropsType>){
    const {value}=nextProps
    const {value:prevValue}=this.props
    return value===prevValue
  }

  render() {
    const { enumData, ...rest } = this.props;
    return (
      <Select
        style={{ width: '100%', height: 24 }}
        className={styles.select}
        showSearch
        allowClear
        {...rest}
      >
        {map(enumData, (item, index) => {
            let key = '',label = '';
            if (isObject(item)) {
              ({ key, label } = item);
            } else {
              key =label= item;
            }
            return (
              <Option value={key} key={index}>
                <Tooltip overlayStyle={{ zIndex: 1800 }} title={label}>
                  {label}
                </Tooltip>
              </Option>
            );
          },
        )}
      </Select>
    );
  }


}


export default  EnumComponent
