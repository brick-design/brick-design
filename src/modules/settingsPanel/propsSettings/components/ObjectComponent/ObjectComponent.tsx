import React, { createElement, Component } from 'react';
import { Form, Tooltip,Row,Col } from 'antd';
import { Icon } from '@/components';
import { confirmModal, TYPES_TO_COMPONENT } from '../../config';
import map from 'lodash/map';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual'
import SelectAddProps from './SelectAddProps';
import styles from '../../index.less';
import {ACTION_TYPES} from '@/models';
import { filterProps, reduxConnect,formatPropsFieldConfigPath } from '@/utils';
import isArray from 'lodash/isArray';
import { SwitchMultiTypes } from '../index';
import each from 'lodash/each';
import { PropInfoType, PropsConfigType } from '@/types/ComponentConfigType';
import {Dispatch} from 'redux'
import { FormComponentProps } from 'antd/es/form';
import { PROPS_TYPES } from '@/types/ConfigTypes';

interface ObjectComponentPropsType extends FormComponentProps{
  childPropsConfig:PropsConfigType,
  tabIndex:number,
  value?:any,
  dispatch?:Dispatch,
  parentFieldPath:string,
  type:PROPS_TYPES,
  field:string,
  isHideDivider:boolean,
  onChange?:(value:any)=>void
}

const FormItem = Form.Item;

@reduxConnect()
class ObjectComponent extends Component<ObjectComponentPropsType> {

  shouldComponentUpdate(nextProps:ObjectComponentPropsType){
    const {childPropsConfig,tabIndex,value}=nextProps
    const {childPropsConfig:prevChildPropsConfig,tabIndex:prevTabIndex,value:prevValue}=this.props
    return !isEqual(childPropsConfig,prevChildPropsConfig)||!isEqual(prevTabIndex,tabIndex)||!isEqual(prevValue,value)
  }

  renderFormItemTitle = (config:PropInfoType, field:string) => {
    const { label, tip,isAdd } = config;
    return (
      <span className={styles['form-item-title-container']}>
        <Tooltip title={tip || label}>{label}</Tooltip>
        {isAdd && (
          <Icon
            type="delete"
            style={{ paddingLeft: '7px' }}
            onClick={() => this.deletePropsConfig(field)}
          />
        )}
      </span>
    );
  };


  /**
   * 删除字段
   * @param field
   */
  deletePropsConfig = (field:string) => {
    const { dispatch, parentFieldPath, type, tabIndex } = this.props;
    confirmModal(() =>
      dispatch!({
        type: ACTION_TYPES.deletePropsConfig,
        payload:{
          field,
          parentFieldPath: formatPropsFieldConfigPath(
            type,
            this.props.field,
            parentFieldPath,
            tabIndex,
          ),
        }

      }),
    );
  };

  renderFormItem = (config:PropInfoType, field:string) => {
    const {
      form,
      parentFieldPath,
      tabIndex,
    } = this.props;
    const{ getFieldDecorator }=form
    const { type, rules } = config;
    const { defaultValue, value, ...props }:any = {
      field,
      ...config,
      parentFieldPath: formatPropsFieldConfigPath(
        this.props.type,
        this.props.field,
        parentFieldPath,
        tabIndex,
      ),
      size: type === PROPS_TYPES.boolean ? 'default' : 'small',
    };

    if (isArray(type)) return <SwitchMultiTypes
      componentProps={props}
      key={`${field}`}
      extraObj={{ rules }}
      field={field}
      types={type}
      form={form}
      tip={config.tip}
      label={config.label}
    />;

    return (
      <Col span={24} key={field}>
      <FormItem key={field} label={this.renderFormItemTitle(config, field)}>
        {getFieldDecorator(field, { rules })(
          createElement(get(TYPES_TO_COMPONENT,type), props),
        )}
      </FormItem>
      </Col>
    );
  };

  render() {
    const { childPropsConfig, parentFieldPath, field, type, isHideDivider, tabIndex } = this.props;
    return (
      <Form className={isHideDivider ? '' : styles.divider}>
        <Row>
        {map(childPropsConfig, this.renderFormItem)}
        </Row>
        <SelectAddProps
          parentFieldPath={formatPropsFieldConfigPath(type, field, parentFieldPath, tabIndex)}
        />
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields(props:ObjectComponentPropsType) {
    const { value} = props;
    const formatFields:any = {};
    each(value, (v, field) => (formatFields[field] = Form.createFormField({ value: v })));
    return formatFields;
  },
  onValuesChange: (props:ObjectComponentPropsType, _, allValues) => {
    const { onChange } = props;
    onChange && onChange(filterProps(allValues));
  },
})(ObjectComponent)
