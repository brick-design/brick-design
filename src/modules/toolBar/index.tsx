import React, { Component, createElement, RefObject, useEffect, useRef, useState } from 'react';
import { Col, Modal, Row,Tooltip} from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import isString from 'lodash/isString';
import menus, { CONTEXT_MENU, ENABLED } from './config';
import styles from './style.less';
import {ACTION_TYPES} from '@/models';
import { reduxConnect, usePrevious } from '@/utils';
import PreviewAndCode from '../previewAndCode';
import GenerateTemplate from './component/GenerateTemplate';
import { Icon } from '../../components';
import { handleRequiredHasChild } from '@/utils';
import { PlatformInfoType, SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import {Dispatch } from 'redux'
import ContextMenu from './component/ContextMenu'
import { formatMessage } from 'umi-plugin-react/locale';
const REST_STYLE = 'resetStyle';
const UNDO = 'undo';
const REDO = 'redo';
const CLEAR='clear';

interface ToolBarPropsType {
  dispatch?:Dispatch,
  selectedComponentInfo?:SelectedComponentInfoType,
  componentConfigs?:VirtualDOMType[],
  undo?:any[],
  redo?:any[],
  styleSetting?:any,
  platformInfo?:PlatformInfoType

}

function ToolBar(props:ToolBarPropsType) {
  const {selectedComponentInfo, componentConfigs, undo, redo,styleSetting,dispatch,platformInfo}=props
  const {style,isContainer}=selectedComponentInfo!

  const [visible,setVisible]=useState(false)
  const [isShowTemplate,setIsShowTemplate]=useState(false)

  const enabled:string[] = [];
  useEffect(()=>{
    function onKeyDown(keyEvent:any){
      const {key,ctrlKey,shiftKey,metaKey}=keyEvent
      if(key==='z'&&(ctrlKey||metaKey)){
        if(!shiftKey&&enabled.includes(UNDO)){
          dispatch!({type:ACTION_TYPES.undo});
        }else if(shiftKey&&enabled.includes(REDO)){
          dispatch!({type:ACTION_TYPES.redo});
        }
      }

    }
    addEventListener('keydown',onKeyDown)
    return ()=> removeEventListener('keydown', onKeyDown)
  },[enabled])

  if (style &&!isEqual(style, styleSetting)) enabled.push(REST_STYLE);
  if(isContainer) enabled.push(CLEAR);
  if (!isEmpty(undo)) enabled.push(UNDO);
  if (!isEmpty(redo)) enabled.push(REDO);
  if (isEmpty(selectedComponentInfo)) {
    enabled.push(...ENABLED.must)
  }else if (!isEmpty(componentConfigs)) {
    enabled.push(...ENABLED.must, ...ENABLED.selected)
  }

  /**
   * 生成复合组件
   *
   */
  function generateTemplate ()  {
    if(handleRequiredHasChild(selectedComponentInfo!,componentConfigs!))return
    setVisible(true)
    setIsShowTemplate(true)
  };
  /**
   *  本方式是生成复合组件事件
   *  data   请求de参数
   */

  function addTemplateInfo (data:any) {
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
    setVisible(!visible)
  };



  /**
   * 页面预览
   * @returns {*}
   */

  function preview () {
    if (handleRequiredHasChild(selectedComponentInfo!, componentConfigs!)) return
    setVisible(!visible)
    setIsShowTemplate(false)
}

  const funMap:{[funName:string]:()=>any}={
    preview,
    generateTemplate
  }


    function renderMenu (config:any, key:string){
    const { title, icon, shortcutKey,props={},type } = config;
    if(!isString(icon)) return createElement(icon,{key,...props})
    const disabledColor = '#A4A4A4';
    const enabledColor = '#000';
    const isEnabled = enabled.includes(title);
    let func=undefined
      if(isEnabled){
        func=funMap[title]||(()=>dispatch!({type,payload:{style}}))
      }
    return (
      <Tooltip mouseEnterDelay={1} title={shortcutKey}>
      <div
        style={{ color: isEnabled ? enabledColor : disabledColor }}
        className={styles['icon-container']}
        onClick={func}
        key={key}
      >
        <Icon style={{ fontSize: 18 }} type={icon}/>
        <span>{formatMessage({id:`BLOCK_NAME.toolBar.${title}`})}</span>
      </div>
      </Tooltip>
    );
  }

  function renderGroup (content:any, key:string) {
    const { span, group, style = {} } = content;
    return (
      <Col span={span} key={key}>
        <div style={{ display: 'flex', flex: 1, ...style }}>
          {map(group, renderMenu)}
        </div>
      </Col>
    );
  };


   const modalConfig = isShowTemplate ? {
      title: '生成模板',
      closable: true,
      footer: null,
      onCancel: ()=>setVisible(!visible),
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
            {map(menus, renderGroup)}
          </Row>
        </Col>
        <Modal
          visible={visible}
          destroyOnClose
          {...modalConfig}
        >
          {isShowTemplate ? <GenerateTemplate  uploadFile={addTemplateInfo}/> :
            <PreviewAndCode componentConfigs={componentConfigs!}
                            controlModal={()=>setVisible(!visible)}
                            visible={visible}
                            platformInfo={platformInfo}
            />}
        </Modal>
      </Row>
        <ContextMenu dispatch={dispatch!}
                     isSelected={!isEmpty(selectedComponentInfo)}
                     enableMenu={filter(CONTEXT_MENU,menu=>enabled.includes(menu))}
        />
      </>
    );
  }

export default reduxConnect(['selectedComponentInfo', 'componentConfigs', 'undo', 'redo','styleSetting','platformInfo'])(ToolBar)
