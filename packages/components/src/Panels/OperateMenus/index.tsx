import React from 'react';
import styles from './index.less';
import DragResizeBar from '../../Components/DragResizeBar';
import { stylesIcon } from '../../assets';

export default function OperateMenus(){

	return <DragResizeBar
		title={'Styles'}
		className={styles['container']}
		minWidth={400}
		minHeight={700}
		defaultShow
		barStyle={{ borderBottom: '1px #f2f2f2 solid' }}
		icon={stylesIcon}
		style={{ visibility: 'hidden' }}
	>
		<div>

		</div>
	</DragResizeBar>;
}
