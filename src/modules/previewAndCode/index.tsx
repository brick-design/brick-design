import React from 'react';
import { Icon } from '@/components';
import Code from './components/code';
import Preview from './components/preview';
import styles from './styles.less';
import { Resizable } from 're-resizable';
import { PlatformInfoType, VirtualDOMType } from '@/types/ModelType';

interface PreviewAndCodePropsType {
  visible: boolean,
  controlModal: () => void,
  componentConfigs: VirtualDOMType[],
  platformInfo?: PlatformInfoType
}

function PreviewAndCode(props: PreviewAndCodePropsType) {

  const { controlModal, componentConfigs = [], visible, platformInfo } = props;

  function renderHeader() {
    return (
      <div onClick={controlModal} className={`${styles['preview-header']}  box-line-shadow`}>
        <Icon type='left' style={{ marginRight: 7 }}/>
        Preview
      </div>);

  }
  if (!visible) return null;
  return (
    <>
      {renderHeader()}
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row' }}>
        <Resizable
          defaultSize={{ width: '260px', height: '100%' }}>
          <Code componentConfigs={componentConfigs}/>
        </Resizable>
        <div className={styles['page-container']}>
          <Preview platformInfo={platformInfo} componentConfigs={componentConfigs}/>
        </div>
      </div>
    </>
  );
}

export default PreviewAndCode;
