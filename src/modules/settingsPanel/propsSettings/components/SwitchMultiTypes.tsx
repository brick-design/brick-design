import React, { Component, createElement } from 'react';
import { Form, Tooltip } from 'antd';
import {  TYPES_TO_COMPONENT } from '../config';
import styles from '../index.less';
import EnumComponent from '../../components/EnumComponent';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import keys from 'lodash/keys'
import { PROPS_TYPES } from '@/types/ConfigTypes';
import { FormComponentProps } from 'antd/lib/form';
import { PropsConfigType } from '@/types/ComponentConfigType';

const FormItem = Form.Item;

interface SwitchMultiTypesPropsType extends FormComponentProps{
  types:PROPS_TYPES[],
  field:string,
  childPropsConfig?:PropsConfigType|PropsConfigType[],
  extraObj?:any,
  itemOption?:any,
  formItemProps?:any,
 tip?:string,
  label?:string,
  componentProps:any
}

interface SwitchMultiTypesStateType {
  type:PROPS_TYPES
}

export default class SwitchMultiTypes extends Component<SwitchMultiTypesPropsType,SwitchMultiTypesStateType> {
  constructor(props:SwitchMultiTypesPropsType) {
    super(props);
    const { types } = props;
    this.state = {
      type: types[0],
    };
  }

  componentDidMount() {
    const { form: { getFieldValue }, field } = this.props;
    const value = getFieldValue(field);
    this.handleDefaultValueType(value);
  }

  handleDefaultValueType = (value:any) => {
    const { form: { setFieldsValue }, field, childPropsConfig } = this.props;
    let type = null;
    if (isArray(value)) {
      let firstValue = value[0];
      if (isNumber(firstValue)) {
        type = PROPS_TYPES.numberArray;
      } else if (isString(firstValue)) {
        type = PROPS_TYPES.stringArray;
      } else if (isObject(firstValue)) {
        type = PROPS_TYPES.objectArray;
      }
    } else if (isObject(value)) {
      if (isEmpty(childPropsConfig)||!isEqual(keys(value),keys(childPropsConfig))) {
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

    type && this.setState({ type }, () => {
      setFieldsValue({ [field]: value });
    });
  };

  typeChange = (value:PROPS_TYPES) => {
    this.setState({
      type: value,
    });
  };


  render() {
    const { types, form: { getFieldDecorator }, extraObj = {}, itemOption = {}, formItemProps = {}, field, tip, label, componentProps } = this.props;
    const { type } = this.state;
    if (type === PROPS_TYPES.boolean) {
      extraObj.valuePropName = 'checked';
    }
    return <FormItem style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
                     {...formItemProps}
                     label={<div className={styles['multi-type']}>
                       <Tooltip title={`${field}:${tip || label}`}>{label}</Tooltip>
                       <EnumComponent value={type}
                                      enumData={types}
                                      allowClear={false}
                                      style={{ width: 90, marginLeft: 10 }}
                                      onChange={this.typeChange}/>
                     </div>}>
      {getFieldDecorator(field, { ...extraObj, ...itemOption })(
        createElement(get(TYPES_TO_COMPONENT,type), {
          ...componentProps,
          type,
          size: type === PROPS_TYPES.boolean ? 'default' : 'small',
        }),
      )}
    </FormItem>;
  }
}
