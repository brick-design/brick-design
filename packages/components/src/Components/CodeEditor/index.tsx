import React, { TextareaHTMLAttributes } from 'react';
// import {javascript} from '@codemirror/lang-javascript';
// import { okaidia } from '@uiw/codemirror-theme-okaidia';
// import CodeMirror, { ReactCodeMirrorProps } from './CodeMirror';
// import styles from './index.less';

type CodeEditor = TextareaHTMLAttributes<any>
export default function CodeEditor(props:CodeEditor){
	return <textarea
		// basicSetup
		// className={styles['container']}
		// theme={okaidia}
		// extensions={[javascript()]}
		{...props}
	/>;
}
