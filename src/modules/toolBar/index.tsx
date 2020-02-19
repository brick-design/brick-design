import React, { Component } from 'react';
import { Col, Modal, Row } from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import menus, {  ENABLED } from './config';
import styles from './style.less';
import {ACTION_TYPES} from '@/models';
import { reduxConnect } from '@/utils';
import PreviewAndCode from '../previewAndCode';
import GenerateTemplate from './component/GenerateTemplate';
import { Icon } from '../../components';
import { handleRequiredHasChild } from '@/utils';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import {Dispatch } from 'redux'
const REST_STYLE = 'resetStyle';
const UNDO = 'undo';
const REDO = 'redo';

interface ToolBarPropsType {
  dispatch?:Dispatch,
  selectedComponentInfo?:SelectedComponentInfoType,
  componentConfigs?:VirtualDOMType[],
  undo?:any[],
  redo?:any[],
  styleSetting?:any,

}

interface ToolBarStateType {
  enabled: string[],
  visible: boolean,
  isShowTemplate: boolean,
}

@reduxConnect(['selectedComponentInfo', 'componentConfigs', 'undo', 'redo','styleSetting'])
class ToolBar extends Component<ToolBarPropsType,ToolBarStateType> {

  constructor(props:ToolBarPropsType) {
    super(props);
    this.state = {
      enabled: [],
      visible: false,
      isShowTemplate: false,
    };
  }

  static getDerivedStateFromProps(nextProps:ToolBarPropsType) {
    const { selectedComponentInfo, componentConfigs, undo, redo,styleSetting } = nextProps;
    const { style: prevStyle } = selectedComponentInfo!;
    let enabled = [];

    if (prevStyle && !isEqual(prevStyle, styleSetting)) {
      enabled.push(REST_STYLE);
    }

    if (!isEmpty(undo)) {
      enabled.push(UNDO);
    }
    if (!isEmpty(redo)) {
      enabled.push(REDO);
    }

    if (isEmpty(componentConfigs)) {
      return { enabled };
    }

    if (isEmpty(selectedComponentInfo)) {
      enabled = concat(enabled, ENABLED.must);
      return { enabled };
    }

    enabled = concat(enabled, ENABLED.must, ENABLED.selected);

    return { enabled };
  }


  dispatchData = (actions:any) => {
    const { dispatch } = this.props;
    dispatch!(actions);
  };

  /**
   * 删除选中组件
   */
  deleteComponent = () => this.dispatchData({ type: ACTION_TYPES.deleteComponent });

  /**
   * 复制选中组件
   */
  copyComponent = () => this.dispatchData({ type: ACTION_TYPES.copyComponent });

  /**
   * 重做
   */
  redo = () => this.dispatchData({ type: ACTION_TYPES.redo });

  /**
   * 样式重做
   */
  resetStyle = () => {
    const { selectedComponentInfo } = this.props;
    const { style }=selectedComponentInfo!
    this.dispatchData({ type: ACTION_TYPES.changeStyles,payload:{style}  });
  };

  /**
   * 导出代码
   */
  outputFiles = () => this.dispatchData({ type: ACTION_TYPES.outputFiles });

  /**
   * 清除子组件
   */
  clearChildNodes = () => this.dispatchData({ type: ACTION_TYPES.clearChildNodes });
  /**
   * 生成复合组件
   *
   */
  generateTemplate = () => {
    const {selectedComponentInfo,componentConfigs}=this.props
    if(handleRequiredHasChild(selectedComponentInfo!,componentConfigs!))return
      return this.setState({
        visible: true,
        isShowTemplate: true,
      });
  };
  /**
   *  本方式是生成复合组件事件
   *  data   请求de参数
   */

  addTemplateInfo = (data:any) => {
    const { dispatch, selectedComponentInfo, componentConfigs } = this.props;
    const { path }=selectedComponentInfo!
    const { templateName,srcImg } = data;
    const currentComponentInfo = get(componentConfigs, path, {});
    if (!isEmpty(currentComponentInfo)) {
      dispatch!({
        type: ACTION_TYPES.addTemplateInfo,
        payload: {
          img: srcImg,
          name: templateName,
          config: JSON.stringify(currentComponentInfo),
        },
      });
    }

    this.controlModal();
  };

  /**
   * 保存组件信息
   */

  saveComponentsInfo = () => {
    const { dispatch } = this.props;

  };




  /**
   * 页面预览
   * @returns {*}
   */

  previewPage = () => {
    const { selectedComponentInfo, componentConfigs } = this.props
    if (handleRequiredHasChild(selectedComponentInfo!, componentConfigs!)) return
  this.setState({ visible: !this.state.visible, isShowTemplate: false });
}
  /**
   * 撤销
   */
  undo = () => this.dispatchData({ type: ACTION_TYPES.undo });


  renderMenu = (config:any, key:string) => {
    const { title, icon, event } = config;
    const { enabled } = this.state;
    const disabledColor = '#A4A4A4';
    const enabledColor = '#000';
    const isEnabled = enabled.includes(title);

    return (
      <div
        style={{ color: isEnabled ? enabledColor : disabledColor }}
        className={styles['icon-container']}
        onClick={isEnabled ? get(this,event) : undefined}
        key={key}
      >
        <Icon style={{ fontSize: 18 }} type={icon}/>
        <span>{title}</span>
      </div>
    );
  };

  renderGroup = (content:any, key:string) => {
    const { span, group, style = {} } = content;
    return (
      <Col span={span} key={key}>
        <div style={{ display: 'flex', flex: 1, ...style }}>
          {map(group, this.renderMenu)}
        </div>
      </Col>
    );
  };


  controlModal = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible, isShowTemplate } = this.state;
    const { componentConfigs } = this.props;
    const modalConfig = isShowTemplate ? {
      title: '生成模板',
      closable: true,
      footer: null,
      onCancel: this.controlModal,
    } : {
      width: '100%',
      bodyStyle: {
        padding: 0,
        overflow: 'hidden',
        height: '100vh',
      },
      footer: null,
      closable: false,
      wrapClassName: styles['full-screen'],
    };
    return (
      <Row type="flex" justify="space-around" align="middle" className={styles.content}>
        <Col style={{ fontSize: '16px', paddingLeft: '21px' }} span={3}>React-Visual-Editor</Col>
        <Col span={21}>
          <Row>
            {map(menus, this.renderGroup)}
          </Row>
        </Col>
        <Modal
          visible={visible}
          destroyOnClose
          {...modalConfig}
        >
          {isShowTemplate ? <GenerateTemplate  uploadFile={this.addTemplateInfo}/> :
            <PreviewAndCode componentConfigs={componentConfigs!}
                            controlModal={this.controlModal}
                            visible={visible}
            />}
        </Modal>
      </Row>
    );
  }
}

export default ToolBar
