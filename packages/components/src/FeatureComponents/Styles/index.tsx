import React,{memo} from 'react';
import styles from './index.less';
import DragResizeBar from '../../Components/DragResizeBar';
import { stylesIcon } from '../../assets';

function Styles(){
	return <DragResizeBar title={'Styles'}
												className={styles['container']}
												minWidth={212}
												minHeight={400} defaultShow icon={stylesIcon}>

	</DragResizeBar>;
}

export default memo(Styles);
