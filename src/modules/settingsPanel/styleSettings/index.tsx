import React, { Component, createElement } from 'react';
import { Col, Collapse, Form, Row, Tooltip } from 'antd';
import map from 'lodash/map';
import each from 'lodash/each';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import cssConfig from './styleConfigs';
import styleSheet from './index.less';
import {ACTION_TYPES} from '@/models';
import { filterProps, reduxConnect } from '../../../utils';
import { CSS_TYPE_TO_COMPONENT } from './config';
import { Icon } from '../../../components';
import { FormComponentProps } from 'antd/lib/form';
import {Dispatch} from 'redux'
const FormItem = Form.Item;
const { Panel } = Collapse;

interface StyleSettingsPropsType extends FormComponentProps{
  styleSetting:any,
  dispatch?:Dispatch
}

interface StyleSettingsStateType {
  openKeys:string[]
}

class StyleSettings extends Component<StyleSettingsPropsType,StyleSettingsStateType> {

  currentStyle?:any
  constructor(props:StyleSettingsPropsType) {
    super(props);
    this.state = {
      openKeys: map(cssConfig, (_, key) => key),
    };
    this.currentStyle = undefined;
  }


  shouldComponentUpdate(nextProps:StyleSettingsPropsType, nextState:StyleSettingsStateType) {
    const { form: { getFieldsValue } } = this.props;
    const { openKeys } = nextState;
    const { openKeys: prevOpenKeys } = this.state;
    const currentStyle = filterProps(getFieldsValue());
    if (!isEqual(this.currentStyle, currentStyle) || !isEqual(openKeys, prevOpenKeys)) {
      this.currentStyle = currentStyle;
      return true;
    }
    return false;
  }


  /**
   * 折叠触发器
   * @param openKeys
   */
  collapseChange = (openKeys:any) => this.setState({ openKeys });

  renderHeader = (title:string, key:string) => {
    const { openKeys } = this.state;
    const isFold = openKeys.includes(key);
    return (
      <div className={styleSheet['fold-header']}>
        <span>{title}</span>
        <Icon
          className={isFold ? styleSheet.rotate180 : ''}
          style={{ marginLeft: '5px', transition: 'all 0.2s' }}
          type="caret-up"
        />
      </div>
    );
  };

  renderColItem = (config:any, field:string) => {
    const { label, tip = '', labelPlace = 'left', span = 6, type, labelSpan = 4, valueSpan = 20, props = { size: 'small' } } = config;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Col span={span} key={field}>
        <FormItem>
          <Row type="flex" justify="space-around" align="middle">
            {
              labelPlace === 'left' && (
                <Col style={{ fontSize: 12 }} span={labelSpan}>
                  <Tooltip title={tip || field}>
                    {label}
                  </Tooltip>
                </Col>
              )
            }
            <Col span={valueSpan}>
              {getFieldDecorator(field, {})(createElement(get(CSS_TYPE_TO_COMPONENT,type), props))}
              {
                labelPlace === 'bottom' && (
                  <div className={styleSheet['bottom-label']}>
                    <Tooltip placement="bottom" title={tip || field}>
                      {label}
                    </Tooltip>
                  </div>
                )
              }
            </Col>
            <Col span={24 - labelSpan - valueSpan}/>
          </Row>
        </FormItem>
      </Col>);
  };

  renderFormItem = (configValue:any, key:string) => {
    const { label, styles } = configValue;
    return (
      <Panel showArrow={false} className={styleSheet['panel-border']} header={this.renderHeader(label, key)} key={key}>
        <Row gutter={10}>
          {map(styles, this.renderColItem)}
        </Row>
      </Panel>);
  };

  render() {
    const { openKeys } = this.state;
    return (
      <Form className={styleSheet['form-container']}>
        <Collapse activeKey={openKeys}
                  style={{ margin: 0, backgroundColor: '#0000' }}
                  bordered={false}
                  onChange={this.collapseChange}>
          {map(cssConfig, this.renderFormItem)}
        </Collapse>
      </Form>
    );
  }
}

export default reduxConnect(['styleSetting'])(Form.create<StyleSettingsPropsType>({
  mapPropsToFields(props) {
    const {
      styleSetting,
    } = props;
    const formatFields:any = {};
    each(styleSetting, (v, field) => (formatFields[field] = Form.createFormField({ value: v })));
    return formatFields;
  },
  onValuesChange: (props, _, allValues) => {
    const { dispatch } = props;
    const style:any = {};
    each(allValues, (v, k) => {
      if (v !== undefined) style[k] = v;
    });
    dispatch!({
      type: ACTION_TYPES.changeStyles,
      payload:{
        style
      }
    });
  },
})(StyleSettings))
