import React, { Component, createElement, createRef } from 'react';
import { Affix, Button, Form, Tooltip } from 'antd';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { DEFAULT_PROPS,  settingFormOption, TYPES_TO_COMPONENT } from './config';
import styles from './index.less';
import {ACTION_TYPES} from '@/models';
import { filterProps, reduxConnect } from '@/utils';
import SwitchMultiTypes from './components/SwitchMultiTypes';
import { FormComponentProps } from 'antd/lib/form';
import { PropsSettingType, SelectedComponentInfoType } from '@/types/ModelType';
import {Dispatch} from 'redux'
import { PROPS_TYPES } from '@/types/ConfigTypes';
import { PropInfoType } from '@/types/ComponentConfigType';
const FormItem = Form.Item;

interface PropsSettingsPropsType extends FormComponentProps{
  dispatch?:Dispatch,
  propsSetting?:PropsSettingType,
  selectedComponentInfo?:SelectedComponentInfoType
}

@reduxConnect(['propsSetting', 'selectedComponentInfo'])
class PropsSettings extends Component<PropsSettingsPropsType> {
  container:any
  currentProps?:any
  constructor(props:PropsSettingsPropsType) {
    super(props);
    this.container = createRef();
    this.currentProps = undefined;
  }

  shouldComponentUpdate(nextProps:PropsSettingsPropsType) {
    const { propsSetting} = nextProps;
    const  { mergePropsConfig } =propsSetting!
    const { form: { getFieldsValue }, propsSetting:prevPropsSetting } = this.props;
    const prevMergePropsConfig=get(prevPropsSetting,'mergePropsConfig')
    const currentProps = filterProps(getFieldsValue());
    if (!isEqual(mergePropsConfig, prevMergePropsConfig) || !isEqual(this.currentProps, currentProps)) {
      this.currentProps = currentProps;
      return true;
    }
    return false;
  }

  /**
   * 渲染form items
   * @param config
   * @param field
   * @returns {*}
   */
  renderFormItem = (config:PropInfoType, field:string) => {
    const {
      form: { getFieldDecorator },
      form,
      selectedComponentInfo ,
    } = this.props;
    const{ selectedKey }=selectedComponentInfo!
    const { type, label, rules, tip, formItemProps } = config;

    let itemProps:any={}, itemOption:any={};
    /**
     * 设置form rules
     */
    const extraObj:any = {
      rules,
    };

    // /**
    //  * 属性镜像默认值
    //  */
    // if (mirrorValue) {
    //   extraObj.initialValue = get(propsSetting, mirrorValue);
    // }

    /**
     * 如果属性为boolean类型设置form 获取值的属性
     */
    if (type === PROPS_TYPES.boolean) {
      extraObj.valuePropName = 'checked';
    }
    /**
     * 清除属性配置中的defaultValue,value 目的是消除form警告
     */
    const { defaultValue, value, ...props }:any = {
      field, ...config, ...itemProps,
      size: type === PROPS_TYPES.boolean ? 'default' : 'small',
    };
    if (isArray(type)) return (<SwitchMultiTypes componentProps={props}
                                                 formItemProps={formItemProps}
                                                 key={`${field}${selectedKey}`}
                                                 extraObj={extraObj}
                                                 itemOption={itemOption}
                                                 field={field}
                                                 types={type}
                                                 form={form}
                                                 tip={tip}
                                                 label={label}

    />);
    return (
      <FormItem key={`${field}${selectedKey}`}
                style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}
                {...formItemProps} label={<Tooltip title={`${field}:${tip || label}`}>{label}</Tooltip>}>
        {getFieldDecorator(field, { ...extraObj, ...itemOption })(
          createElement(get(TYPES_TO_COMPONENT,type), props),
        )}
      </FormItem>
    );
  };

  /**
   * 提交最终属性结果
   */
  submitProps = (e:any) => {
    e.preventDefault();
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((err, values) => {
      dispatch!({
        type: ACTION_TYPES.submitProps,
        payload:{
          props: filterProps(values)
        }
      });
    });
  };

  resetProps = () => {
    const {
      form: { resetFields, setFieldsValue },
      propsSetting
    } = this.props;
    const { props }=propsSetting!
    resetFields();
    setFieldsValue(props);

  };

  render() {
    const { propsSetting  } = this.props;
    const { mergePropsConfig }=propsSetting!
    return (
      <>
        {!isEmpty(mergePropsConfig) && (
          <div className={styles['btn-wrap']}>
            <Button style={{ fontSize: 12 }} onClick={this.resetProps}>
              重置
            </Button>
            <Button type="primary" onClick={this.submitProps} style={{ fontSize: 12, marginLeft: '20px' }}>
              提交
            </Button>
          </div>
        )}
      <div ref={this.container} className={styles['main-container']} style={{ position: 'relative' }}>
        <Form className={styles['form-container']} layout="vertical">
          {!isEmpty(mergePropsConfig) && map({ ...mergePropsConfig, ...DEFAULT_PROPS }, this.renderFormItem)}
        </Form>
      </div>
        </>
    );
  }
}
export default Form.create<PropsSettingsPropsType>(settingFormOption)(PropsSettings)
