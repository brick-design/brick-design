import React, { useEffect } from 'react';
import DesignPanel from './modules/designPanel';
import SettingsPanel from './modules/settingsPanel';
import styles from './index.less';
import AllComponents from './modules/componentsPreview';
import ToolBar from './modules/toolBar';
import { Resizable } from 're-resizable';
import 'antd/dist/antd.css';
import 'animate.css/animate.min.css';
import { initDB } from './service';

const COMMON_ENABLE={
  top: false,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
}
const LEFT_ENABLE = {
  ...COMMON_ENABLE,
  right: true,
};

const RIGHT_ENABLE = {
  ...COMMON_ENABLE,
  left: true,

};

const tableIndexs=[
  { name:'name', keyPath:'name', options:{unique: true} },
  { name:'img', keyPath:'img', options:{unique: false} },
  { name:'config', keyPath:'config', options:{unique: false} },
]

export default function Index() {
  useEffect(()=>{
    initDB('test' ,'templates',  { autoIncrement: true },
      tableIndexs);
  },[])

    return (
        <div className={styles.wrapper}>
          <ToolBar/>
          <div
            className={styles.content}
          >
            <Resizable
              enable={LEFT_ENABLE}
              defaultSize={{ width: '260px', height: '100%' }}
              className={styles['left-preview']}
            >
              <AllComponents/>
            </Resizable>

            <div className={styles['canvas-container']}>
              <DesignPanel/>
            </div>
            <Resizable
              enable={RIGHT_ENABLE}
              defaultSize={{ width: '300px',height:'100%' }}
              className={styles['props-shadow']}
            >
              <SettingsPanel/>
            </Resizable>
          </div>
        </div>
    );
  }

