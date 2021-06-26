import React, { forwardRef, memo } from 'react';
import { Select, Tooltip } from 'antd';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import { SelectProps } from 'antd/lib/select';
import styles from '../index.less';
import { propsAreEqual } from '../utils';

const { Option } = Select;

interface EnumComponentPropsType extends SelectProps {
  enumData: string[] | { key: string; label: string };
  onChange: (value: any) => void;
}

const EnumComponent = forwardRef(function Component(
  props: EnumComponentPropsType,
  ref: any,
) {
  const { enumData, ...rest } = props;
  return (
    <Select
      ref={ref}
      style={{ width: '100%', height: 24 }}
      className={styles.select}
      showSearch
      allowClear
      {...rest}
    >
      {map(enumData, (item, index) => {
        let key = '',
          label = '';
        if (isObject(item)) {
          ({ key, label } = item);
        } else {
          key = label = item;
        }
        return (
          <Option value={key} key={index}>
            <Tooltip overlayStyle={{ zIndex: 1800 }} title={label}>
              {label}
            </Tooltip>
          </Option>
        );
      })}
    </Select>
  );
});

export default memo<EnumComponentPropsType>(EnumComponent, propsAreEqual);
