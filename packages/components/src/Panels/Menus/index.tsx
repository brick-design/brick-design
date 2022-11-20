import React from 'react';
import styles from './index.less';
import DragResizeBar from '../../Components/DragResizeBar';
import { stylesIcon } from '../../assets';

export default function Menus(){

	return <DragResizeBar
		title={'Styles'}
		className={styles['container']}
		defaultShow
		barStyle={{ borderBottom: '1px #f2f2f2 solid' }}
		icon={stylesIcon}
		style={{ visibility: 'hidden' }}
	>
		<div>

		</div>
	</DragResizeBar>;
}
