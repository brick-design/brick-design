import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Spin} from 'antd';
import get from 'lodash/get';
import styles from './style.less';
import {addComponent, clearHovered, LegoProvider, useSelector,} from '@/store';
import config from '@/configs';
import ReactDOM from 'react-dom';
import {flattenDeepArray} from "@/utils";
import Container from './warppers/Container'
import  NoneContainer from './warppers/NoneContainer'
import {containers} from "@/modules/designPanel/commom/constants";

export function onDragover(e: any) {
  e.preventDefault();

}

export function onDrop(e: any) {
  e.stopPropagation();
  addComponent()
}

/**
 * 鼠标离开设计区域清除hover状态
 */
const stateSelector=['componentConfigs', 'platformInfo']
function DesignPanel() {
  const { componentConfigs, platformInfo } = useSelector(stateSelector);
  const [spinShow, setSpinShow] = useState(true);
  let designPage: any = useMemo(()=>{
    if(!componentConfigs.root) return null
      const {  root:{componentName} } = componentConfigs;
    const props={
      specialProps:{
        domTreeKeys: ['root'],
        key:"root"
      }
    }
      return  containers.includes(componentName)?<Container {...props} />:<NoneContainer {...props}/>
  },[componentConfigs]);

  const divContainer = useRef(null);

  useEffect(() => {
    const iframe: any = document.getElementById('dnd-iframe');
    iframe.contentWindow.addEventListener('dragover', onDragover);
    iframe.contentWindow.addEventListener('drop', onDrop);
    if (!spinShow) {
      divContainer.current = iframe.contentDocument.getElementById('dnd-container');
      ReactDOM.render(
          <LegoProvider>
        {designPage}
      </LegoProvider>, divContainer.current);
    }
    return () => {
      iframe.contentWindow.removeEventListener('dragover', onDragover);
      iframe.contentWindow.removeEventListener('drop', onDrop);
    };

  }, [spinShow]);

  useEffect(() => {
    if (divContainer.current)
      ReactDOM.render(
          <LegoProvider>
            {designPage}
      </LegoProvider>, divContainer.current);
  }, [divContainer.current, designPage]);

  const { size } = platformInfo;

  const style = { width: size[0], maxHeight: size[1], transition: 'all 700ms' };

  return (
    <div style={style}
         className={`${styles['browser-mockup']} ${styles['with-url']}`}
    >
      <Spin size={'large'}
            style={{ maxHeight: '100%' }}
            wrapperClassName={styles['dnd-container']}
            spinning={spinShow}
      >

        <iframe onMouseLeave={clearHovered}
                id="dnd-iframe"
                className={styles['dnd-container']}
                srcDoc={config.iframeSrcDoc}
                onLoad={useCallback(() => setSpinShow(false),[])}
        />
      </Spin>
    </div>
  );
}

export default DesignPanel;
