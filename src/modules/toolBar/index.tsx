import React, { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Modal, Row, Tooltip } from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import menus, { CONTEXT_MENU, ENABLED } from './config';
import styles from './style.less';
import { ACTION_TYPES } from '@/models';
import { handleRequiredHasChild, reduxConnect } from '@/utils';
import PreviewAndCode from '../previewAndCode';
import GenerateTemplate from './component/GenerateTemplate';
import { Icon } from '../../components';
import { PlatformInfoType, SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { Dispatch } from 'redux';
import ContextMenu from './component/ContextMenu';
import { formatMessage } from 'umi-plugin-react/locale';

const REST_STYLE = 'resetStyle';
const UNDO = 'undo';
const REDO = 'redo';
const CLEAR = 'clear';

interface ToolBarPropsType {
  dispatch?: Dispatch,
  selectedComponentInfo?: SelectedComponentInfoType,
  componentConfigs?: VirtualDOMType[],
  undo?: any[],
  redo?: any[],
  styleSetting?: any,
  platformInfo?: PlatformInfoType

}

let dispatch: Dispatch;


function renderMenu(config: any, key: string, enabled: string[], funMap: any, style: any) {
  const { title, icon, shortcutKey, props = {}, type } = config;
  if (!isString(icon)) return createElement(icon, { key, ...props });
  const disabledColor = '#A4A4A4';
  const enabledColor = '#000';
  const isEnabled = enabled.includes(title);
  let func = undefined;
  if (isEnabled) {
    func = funMap[title] || (() => dispatch({ type, payload: { style } }));
  }
  return (
    <Tooltip key={key} mouseEnterDelay={1} title={shortcutKey}>
      <div
        style={{ color: isEnabled ? enabledColor : disabledColor }}
        className={styles['icon-container']}
        onClick={func}
        key={key}
      >
        <Icon style={{ fontSize: 18 }} type={icon}/>
        <span>{formatMessage({ id: `BLOCK_NAME.toolBar.${title}` })}</span>
      </div>
    </Tooltip>
  );
}

function renderGroup(content: any, key: string, enabled: string[], funMap: any, resetStyle: any) {
  const { span, group, style = {} } = content;
  return (
    <Col span={span} key={key}>
      <div style={{ display: 'flex', flex: 1, ...style }}>
        {map(group, (config: any, k: string) => renderMenu(config, k, enabled, funMap, resetStyle))}
      </div>
    </Col>
  );
}

function onKeyDown(keyEvent: any, enabled: string[]) {
  const { key, ctrlKey, shiftKey, metaKey } = keyEvent;
  if (key === 'z' && (ctrlKey || metaKey)) {
    if (!shiftKey && enabled.includes(UNDO)) {
      dispatch!({ type: ACTION_TYPES.undo });
    } else if (shiftKey && enabled.includes(REDO)) {
      dispatch!({ type: ACTION_TYPES.redo });
    }
  }

}

function ToolBar(props: ToolBarPropsType, ref: any) {
  const { selectedComponentInfo, componentConfigs, undo, redo, styleSetting, platformInfo } = props;
  dispatch = props.dispatch!;
  const { style, isContainer, path } = selectedComponentInfo!;

  const [visible, setVisible] = useState(false);
  const [isShowTemplate, setIsShowTemplate] = useState(false);

  const enabled: string[] = [];

  /**
   * 键盘监听 实现快捷键操作
   */
  useEffect(() => {
    const keyListener = (e: any) => onKeyDown(e, enabled);
    addEventListener('keydown', keyListener);
    return () => removeEventListener('keydown', keyListener);
  }, [enabled]);

  if (style && !isEqual(style, styleSetting)) enabled.push(REST_STYLE);
  if (isContainer) enabled.push(CLEAR);
  if (!isEmpty(undo)) enabled.push(UNDO);
  if (!isEmpty(redo)) enabled.push(REDO);
  if (isEmpty(selectedComponentInfo)) {
    enabled.push(...ENABLED.must);
  } else if (!isEmpty(componentConfigs)) {
    enabled.push(...ENABLED.must, ...ENABLED.selected);
  }

  /**
   * 生成复合组件
   *
   */
  const generateTemplate = useCallback(() => {
    if (handleRequiredHasChild(selectedComponentInfo!, componentConfigs!)) return;
    setVisible(true);
    setIsShowTemplate(true);
  }, [selectedComponentInfo, componentConfigs]);

  /**
   *  本方式是生成复合组件事件
   *  data   请求de参数
   */

  const addTemplateInfo = useCallback((data: any) => {
    const { templateName, srcImg } = data;
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
    setVisible(false);
  }, [path, componentConfigs]);


  /**
   * 页面预览
   * @returns {*}
   */

  const preview = useCallback(() => {
    if (handleRequiredHasChild(selectedComponentInfo!, componentConfigs!)) return;
    setVisible(true);
    setIsShowTemplate(false);
  }, [selectedComponentInfo, componentConfigs]);

  const funMap: { [funName: string]: () => any } = {
    preview,
    generateTemplate,
  };


  const modalConfig = isShowTemplate ? {
    title: '生成模板',
    closable: true,
    footer: null,
    onCancel: () => setVisible(!visible),
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
    <>
      <Row type="flex" justify="space-around" align="middle" className={styles.content}>
        <Col style={{ fontSize: '16px', paddingLeft: '21px' }} span={3}>React-Visual-Editor</Col>
        <Col span={21}>
          <Row>
            {useMemo(() => map(menus, (content: any, key: string) => renderGroup(content, key, enabled, funMap, style)), [enabled, style])}
          </Row>
        </Col>
        <Modal
          visible={visible}
          destroyOnClose
          {...modalConfig}
        >
          {isShowTemplate ? <GenerateTemplate uploadFile={addTemplateInfo}/> :
            <PreviewAndCode componentConfigs={componentConfigs!}
                            controlModal={() => setVisible(false)}
                            visible={visible}
                            platformInfo={platformInfo}
            />}
        </Modal>
      </Row>
      <ContextMenu dispatch={dispatch!}
                   isSelected={!isEmpty(selectedComponentInfo)}
                   enableMenu={useMemo(() => filter(CONTEXT_MENU, menu => enabled.includes(menu)), [enabled])}
      />
    </>
  );
}

export default reduxConnect(['selectedComponentInfo', 'componentConfigs', 'undo', 'redo', 'styleSetting', 'platformInfo'])(ToolBar);
