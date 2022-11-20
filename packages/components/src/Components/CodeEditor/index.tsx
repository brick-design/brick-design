import React, { memo, useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-css';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import styles from './index.less';
import { layersIcon, maxIcon, minIcon } from '../../assets';
import DragResizeBar from '../DragResizeBar';

interface CodeEditorType {
  onChange?: (value: object) => void;
  value?: string | object;
  mode?: 'json5' | 'javascript'|'css';
  name?:string
}
function CodeEditor(props: CodeEditorType) {
  const { value='', onChange, mode,name } = props;
  const [position,setPosition]=useState({width:0,height:0,top:0,left:0});
  const [isChecked,setIsChecked]=useState(false);
  const aceRef=useRef<AceEditor>();
  const onCodeChange = (v) => {
    switch (mode) {
      case 'json5':
        try {
          const data = JSON.parse(v);
          onChange&&onChange(data);
        } catch (e) {
        }
        break;
    }
  };


  useEffect(()=>{
   const {top,width,height,left}=aceRef.current.refEditor.getBoundingClientRect();
   console.log('aceRef》》》》》》》',aceRef);
    setPosition({top,width,height,left});
  },[]);

  const valueResult =
    typeof value === 'string' ? value : JSON.stringify(value, undefined, 2);
  return (
    <div className={styles['container']}>
      <AceEditor
        ref={aceRef}
        value={valueResult}
        debounceChangePeriod={100}
        onChange={isChecked?undefined:onCodeChange}
        mode={mode}
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        style={{ width: '100%', maxHeight: 100 }}
        fontSize={12}
        showGutter={false}
        highlightActiveLine
        placeholder={''}
        className={styles['container-editor']}
        editorProps={{ $blockScrolling: true }}
      />

      <DragResizeBar
        uncheckedIcon={minIcon}
        checkedIcon={maxIcon}
        iconClass={styles['icon-class']}
        checkboxClass={styles['icon']}
        minWidth={400}
        icon={layersIcon}
        title={name}
        onCheckChange={setIsChecked}
        defaultShow={false}
        defaultPosition={position}
        className={styles['max-edit-container']}
      >
        <AceEditor
          value={valueResult}
          placeholder={''}
          debounceChangePeriod={100}
          onChange={isChecked?onCodeChange:undefined}
          style={{ width: '100%', maxHeight: '100%' }}
          mode={mode}
          theme="monokai"
          name="UNIQUE_ID_OF_DIV"
          fontSize={12}
          showGutter
          highlightActiveLine
          enableLiveAutocompletion
          className={styles['container-editor']}
          editorProps={{ $blockScrolling: true }}
        />
      </DragResizeBar>
    </div>
  );
}

export default memo(CodeEditor);
