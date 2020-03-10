import React, { useCallback, useEffect, useRef, useState } from 'react';
import { reduxConnect } from '@/utils';
import { Spin } from 'antd';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { ACTION_TYPES } from '@/models';
import styles from './style.less';
import { Dispatch } from 'redux';
import { PlatformInfoType, SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { oAllComponents } from '@/modules/designPanel/confg';
import config from '@/configs';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

interface DesignPanelPropsType {
  selectedComponentInfo: SelectedComponentInfoType,
  hoverKey: string | null,
  dispatch?: Dispatch,
  componentConfigs?: VirtualDOMType[],
  platformInfo?: PlatformInfoType
}

let dispatch: Dispatch;

function onDragover(e: any) {
  e.preventDefault();

}

function onDrop(e: any) {
  e.stopPropagation();
  dispatch({ type: ACTION_TYPES.addComponent });
}

/**
 * 鼠标离开设计区域清除hover状态
 */
function onMouseLeave() {
  dispatch!({ type: ACTION_TYPES.clearHovered })
}

function DesignPanel(props: DesignPanelPropsType) {

  const { componentConfigs, platformInfo, selectedComponentInfo, hoverKey } = props;
  dispatch = props.dispatch!;
  const [spinShow, setSpinShow] = useState(true);
  let componentNameResult: any, resultProps: any;

  let designPage: any = null;
  if (!isEmpty(componentConfigs)) {
    const { componentName, key } = componentConfigs![0];
    componentNameResult = componentName;
    resultProps = {
      componentConfig: componentConfigs![0],
      path: '[0]',
      domTreeKeys: [key],
      selectedComponentInfo,
      hoverKey,
      dispatch,
    };
    designPage = React.createElement(get(oAllComponents, componentNameResult), resultProps);
  }
  // const divContainer: any = useIframe({ id: 'dnd-iframe', designPage, setSpinShow });
  const divContainer = useRef(null);

  useEffect(() => {
    const iframe: any = document.getElementById('dnd-iframe');
    iframe.contentWindow.addEventListener('dragover', onDragover);
    iframe.contentWindow.addEventListener('drop', onDrop);
    if (!spinShow) {
      divContainer.current = iframe.contentDocument.getElementById('dnd-container');
      ReactDOM.render(designPage, divContainer.current);
    }
    return () => {
      iframe.contentWindow.removeEventListener('dragover', onDragover);
      iframe.contentWindow.removeEventListener('drop', onDrop);
    };

  }, [spinShow]);

  useEffect(() => {
    if (divContainer.current)
      ReactDOM.render(designPage, divContainer.current);
  }, [divContainer.current, designPage]);

  const { size } = platformInfo!;


  const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' };

  return (
    <div style={style}
         className={classNames(`${styles['browser-mockup']} ${styles['with-url']}`)}
    >
      <Spin size={'large'}
            style={{ maxHeight: '100%' }}
            wrapperClassName={styles['dnd-container']}
            spinning={spinShow}
      >

        <iframe onMouseLeave={onMouseLeave}
                id="dnd-iframe"
                className={styles['dnd-container']}
                srcDoc={config.iframeSrcDoc}
                onLoad={useCallback(() => setSpinShow(false),[])}
        />
      </Spin>
    </div>
  );
}

export default reduxConnect(['componentConfigs', 'platformInfo', 'selectedComponentInfo', 'hoverKey'])(DesignPanel);
