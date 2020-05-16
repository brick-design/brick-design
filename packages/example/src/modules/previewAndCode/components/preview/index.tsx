// import React, { createElement, useEffect, useState } from 'react';
// import cloneDeep from 'lodash/cloneDeep';
// import styles from '../../styles.less';
// import map from 'lodash/map';
// import isEmpty from 'lodash/isEmpty';
// import merge from 'lodash/merge';
// import each from 'lodash/each';
// import classNames from 'classnames';
// import get from 'lodash/get';
// import config from '@/configs';
// import {ComponentConfigsType, PlatformInfoType, VirtualDOMType} from '@/store';
// import { PROPS_TYPES } from '@/types/ConfigTypes';
// import { Spin } from 'antd';
// import ReactDOM from 'react-dom';
//
// interface PreviewPropsType {
//   componentConfigs: ComponentConfigsType,
//   platformInfo?: PlatformInfoType
// }
//
//
// export default function Preview(props: PreviewPropsType) {
//   const { componentConfigs, platformInfo } = props;
//   const [visible, setVisible] = useState(false);
//   const [spinShow, setSpinShow] = useState(true);
//
//   useEffect(() => {
//     if (!spinShow) {
//       const iframe: any = document.getElementById('preview-iframe');
//       // ReactDOM.render(analysisPage(componentConfigs) as any, iframe.contentDocument.getElementById('dnd-container'));
//     }
//   }, [spinShow, componentConfigs]);
//
//   // function analysisPage(childNodesArr: string[], onlyNode?: boolean) {
//   //
//   //   const resultComponents = map(childNodesArr, childNode => {
//   //     const { componentName, props, addPropsConfig, childNodes, key } = childNode;
//   //     const { nodePropsConfig, mirrorModalField, propsConfig } = get(config.AllComponentConfigs, componentName);
//   //     const cloneProps = cloneDeep(props);
//   //     if (!isEmpty(childNodes)) {
//   //       if (!nodePropsConfig) {
//   //         cloneProps.children = analysisPage(childNodes);
//   //       } else {
//   //         each(nodePropsConfig, (nodePropsConfig, propName) => {
//   //           const { type, isOnlyNode } = nodePropsConfig;
//   //           let analysisChildNodes = childNodes;
//   //           const propChildNodes = get(childNodes, `${propName}.childNodes`);
//   //           if (propChildNodes && isEmpty(propChildNodes)) return;
//   //           if (propChildNodes && !isEmpty(propChildNodes)) analysisChildNodes = propChildNodes;
//   //           const propNodes = analysisPage(analysisChildNodes as VirtualDOMType[], isOnlyNode);
//   //           cloneProps[propName] = type === PROPS_TYPES.reactNode ? propNodes : () => propNodes;
//   //         });
//   //       }
//   //     }
//   //     const { className = [], animateClass } = cloneProps;
//   //     // 如果有动画类名，添加到className中去
//   //     cloneProps.className = classNames(className, animateClass);
//   //     cloneProps.key = key;
//   //     if (mirrorModalField) {
//   //       const { displayPropName, mountedProps } = handleModalTypeContainer(mirrorModalField, 'preview-iframe');
//   //       cloneProps[displayPropName] = visible;
//   //       merge(cloneProps, mountedProps);
//   //       cloneProps.zIndex = 2000;
//   //       cloneProps.onCancel = () => setVisible(!visible);
//   //     }
//   //     return createElement(get(config.OriginalComponents, componentName, componentName), formatSpecialProps(cloneProps, merge({}, propsConfig, addPropsConfig)));
//   //   });
//   //
//   //   if (onlyNode) return resultComponents[0];
//   //   return resultComponents;
//   // }
//
//   const { size } = platformInfo!;
//   const style = { width: size[0], maxHeight: size[1] };
//
//   return (
//     <div style={style} className={classNames(`${styles['browser-mockup']} ${styles['with-url']}`)}>
//       <Spin size={'large'}
//             style={{ maxHeight: '100%' }}
//             wrapperClassName={styles['dnd-container']}
//             spinning={spinShow}
//       >
//         <iframe id="preview-iframe"
//                 className={styles['dnd-container']}
//                 srcDoc={config.iframeSrcDoc}
//                 onLoad={() => setSpinShow(false)}
//         />
//       </Spin>
//     </div>
//   );
//
// }
