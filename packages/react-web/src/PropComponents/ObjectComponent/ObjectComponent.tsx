import React, { createElement, forwardRef, memo } from 'react';
import { Col, Form, Icon, Row, Tooltip } from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import each from 'lodash/each';
import { PropInfoType, PROPS_TYPES, PropsConfigType } from '@brickd/react';
import { FormComponentProps } from 'antd/es/form';
import SelectAddProps from './SelectAddProps';
import { filterProps, formatPropsFieldConfigLocation } from '../../utils';
import styles from '../../index.less';
import SwitchMultiTypes from '../SwitchMultiTypes';
import { TYPES_TO_COMPONENT } from '../../index';

interface ObjectComponentPropsType extends FormComponentProps {
  childPropsConfig: PropsConfigType;
  tabIndex: number;
  value?: any;
  fatherFieldLocation: string;
  type: PROPS_TYPES;
  field: string;
  isHideDivider: boolean;
  onChange?: (value: any) => void;
}

const FormItem = Form.Item;

function ObjectComponent(props: ObjectComponentPropsType, ref: any) {
  const {
    fatherFieldLocation,
    type,
    tabIndex,
    form,
    childPropsConfig,
    field,
    isHideDivider,
  } = props;

  function renderFormItemTitle(config: PropInfoType, field: string) {
    const { label, tip, isAdd } = config;
    return (
      <span className={styles['form-item-title-container']}>
        <Tooltip title={tip || label}>{label}</Tooltip>
        {isAdd && (
          <Icon
            type="delete"
            style={{ paddingLeft: '7px' }}
            // onClick={() => deletePropsConf(field)}
          />
        )}
      </span>
    );
  }

  function renderFormItem(config: PropInfoType, field: string) {
    const { getFieldDecorator } = form;
    const { type, rules } = config;
    const { defaultValue, value, ...restProps }: any = {
      field,
      ...config,
      fatherFieldLocation: formatPropsFieldConfigLocation(
        props.type,
        props.field,
        fatherFieldLocation,
        tabIndex,
      ),
      size: type === PROPS_TYPES.boolean ? 'default' : 'small',
    };

    if (isArray(type))
      return (
        <SwitchMultiTypes
          componentProps={restProps}
          key={`${field}`}
          extraObj={{ rules }}
          field={field}
          types={type}
          form={form}
          tip={config.tip}
          label={config.label}
        />
      );

    return (
      <Col span={24} key={field}>
        <FormItem key={field} label={renderFormItemTitle(config, field)}>
          {getFieldDecorator(field, { rules })(
            createElement(get(TYPES_TO_COMPONENT, type), restProps),
          )}
        </FormItem>
      </Col>
    );
  }

  return (
    <Form className={isHideDivider ? '' : styles.divider}>
      <Row>{map(childPropsConfig, renderFormItem)}</Row>
      <SelectAddProps
        fatherFieldLocation={formatPropsFieldConfigLocation(
          type,
          field,
          fatherFieldLocation,
          tabIndex,
        )}
      />
    </Form>
  );
}

export default Form.create<ObjectComponentPropsType>({
  mapPropsToFields(props) {
    const { value } = props;
    const formatFields: any = {};
    each(
      value,
      (v, field) => (formatFields[field] = Form.createFormField({ value: v })),
    );
    return formatFields;
  },
  onValuesChange: (props, _, allValues) => {
    const { onChange } = props;
    onChange && onChange(filterProps(allValues));
  },
})(
  memo<ObjectComponentPropsType>(
    forwardRef(ObjectComponent),
    (prevProps, nextProps) => {
      const { childPropsConfig, tabIndex, value } = nextProps;
      const {
        childPropsConfig: prevChildPropsConfig,
        tabIndex: prevTabIndex,
        value: prevValue,
      } = prevProps;
      return (
        isEqual(childPropsConfig, prevChildPropsConfig) &&
        isEqual(prevTabIndex, tabIndex) &&
        isEqual(prevValue, value)
      );
    },
  ),
);
