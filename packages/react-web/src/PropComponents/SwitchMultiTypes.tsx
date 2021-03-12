import React, { createElement, forwardRef, useEffect, useState } from 'react';
import { Form, Tooltip } from 'antd';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import keys from 'lodash/keys';
import { FormComponentProps } from 'antd/lib/form';
import { PROPS_TYPES, PropsConfigType } from '@brickd/react';
import EnumComponent from './EnumComponent';
import styles from '../index.less';
import { TYPES_TO_COMPONENT } from '../index';

const FormItem = Form.Item;

interface SwitchMultiTypesPropsType extends FormComponentProps {
  types: PROPS_TYPES[];
  field: string;
  childPropsConfig?: PropsConfigType | PropsConfigType[];
  extraObj?: any;
  itemOption?: any;
  formItemProps?: any;
  tip?: string;
  label?: string;
  componentProps: any;
}

function SwitchMultiTypes(props: SwitchMultiTypesPropsType, ref: any) {
  const {
    types,
    form: { getFieldValue, setFieldsValue, getFieldDecorator },
    field,
    childPropsConfig,
    extraObj = {},
    itemOption = {},
    formItemProps = {},
    tip,
    label,
    componentProps,
  } = props;
  const [type, setType] = useState(types[0]);
  const value = getFieldValue(field);
  useEffect(() => {
    let type = null;
    if (isArray(value)) {
      const firstValue = value[0];
      if (isNumber(firstValue)) {
        type = PROPS_TYPES.numberArray;
      } else if (isString(firstValue)) {
        type = PROPS_TYPES.stringArray;
      } else if (isObject(firstValue)) {
        type = PROPS_TYPES.objectArray;
      }
    } else if (isObject(value)) {
      if (
        isEmpty(childPropsConfig) ||
        !isEqual(keys(value), keys(childPropsConfig))
      ) {
        type = PROPS_TYPES.json;
      } else {
        type = PROPS_TYPES.object;
      }
    } else if (isNumber(value)) {
      type = PROPS_TYPES.number;
    } else if (isString(value)) {
      type = PROPS_TYPES.string;
    } else if (isBoolean(value)) {
      type = PROPS_TYPES.boolean;
    }
    type && setType(type);
  }, []);

  useEffect(() => {
    setFieldsValue({ [field]: value });
  }, [type]);

  if (type === PROPS_TYPES.boolean) {
    extraObj.valuePropName = 'checked';
  }
  return (
    <FormItem
      style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
      {...formItemProps}
      label={
        <div className={styles['multi-type']}>
          <Tooltip title={`${field}:${tip || label}`}>{label}</Tooltip>
          <EnumComponent
            value={type}
            enumData={types}
            allowClear={false}
            style={{ width: 90, marginLeft: 10 }}
            onChange={(newType) => setType(newType)}
          />
        </div>
      }
    >
      {getFieldDecorator(field, { ...extraObj, ...itemOption })(
        createElement(get(TYPES_TO_COMPONENT, type), {
          ...componentProps,
          type,
          size: type === PROPS_TYPES.boolean ? 'default' : 'small',
        }),
      )}
    </FormItem>
  );
}

export default forwardRef(SwitchMultiTypes);
