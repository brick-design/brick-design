import React, { createElement, PureComponent } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import styles from '../../styles.less';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import each from 'lodash/each';
import classNames from 'classnames';
import get from 'lodash/get';
import config from '@/configs';
import { formatSpecialProps } from '@/utils';
import { PlatformInfoType, VirtualDOMType } from '@/types/ModelType';
import { PROPS_TYPES } from '@/types/ConfigTypes';

interface PreviewPropsType {
  componentConfigs:VirtualDOMType[],
  platformInfo?:PlatformInfoType
}
interface PreviewStateType {
  visible:boolean
}

export default class Preview extends PureComponent<PreviewPropsType,PreviewStateType> {
  constructor(props:PreviewPropsType) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  analysisPage = (childNodesArr:VirtualDOMType[], onlyNode?:boolean) => {

    const resultComponents = map(childNodesArr, childNode => {
      const { componentName, props, addPropsConfig, childNodes, key } = childNode;
      const { nodePropsConfig, mirrorModalField, propsConfig } = get(config.AllComponentConfigs, componentName);
      const cloneProps = cloneDeep(props);
      if (!isEmpty(childNodes)) {
        if (!nodePropsConfig) {
          cloneProps.children = this.analysisPage(childNodes as VirtualDOMType[] );
        } else {
          each(nodePropsConfig, (nodePropsConfig, propName) => {
            const { type, isOnlyNode } = nodePropsConfig;
            let analysisChildNodes = childNodes;
            const propChildNodes = get(childNodes, `${propName}.childNodes`);
            if (propChildNodes && isEmpty(propChildNodes)) return;
            if (propChildNodes && !isEmpty(propChildNodes)) analysisChildNodes = propChildNodes;
            const propNodes = this.analysisPage(analysisChildNodes as VirtualDOMType[], isOnlyNode);
            cloneProps[propName] = type === PROPS_TYPES.reactNode ? propNodes : () => propNodes;
          });
        }
      }
      const { className = [], animateClass } = cloneProps;
      // 如果有动画类名，添加到className中去
      cloneProps.className = classNames(className, animateClass);
      cloneProps.key = key;
      if (mirrorModalField) {
        const {displayPropName, mounted, style} = mirrorModalField;
        const  { propName, type }=mounted
        const mountedNode = document.getElementById('preview-container');
        cloneProps[propName] = type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
        cloneProps[displayPropName] = this.state.visible;
        merge(cloneProps.style, style);
        cloneProps.zIndex = 2000;
        cloneProps.onCancel = this.controlModal;
      }
      return createElement(get(config.OriginalComponents, componentName, componentName), formatSpecialProps(cloneProps, merge({}, propsConfig, addPropsConfig)));
    });

    if (onlyNode) return resultComponents[0];
    return resultComponents;
  };

  controlModal = () => this.setState({
    visible: !this.state.visible,
  });

  render() {
    const { componentConfigs,platformInfo } = this.props;
    const {size}=platformInfo!
    const style={maxWidth:size[0],maxHeight:size[1]}

    return (
      <div id='preview-container' style={style} className={styles['preview-container']}>
        {this.analysisPage(componentConfigs)}
      </div>);
  }

}
