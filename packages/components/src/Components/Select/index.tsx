import React,{memo} from 'react';
import {map} from 'lodash';
import styles from './index.less';
import Icon from '../Icon';
import { arrowLineIcon } from '../../assets';

interface SelectProps extends React.HTMLProps<HTMLSelectElement>{
	enumData:any[]
}
function Select(props:SelectProps){
	const {enumData,value, className,...rest}=props;
	return <div className={`${styles['container']} ${className}`}>
		<select value={value} className={styles['select']} {...rest}>
		{map(enumData,(data)=>	<option key={data}>{data}</option>)}
	</select>
		<Icon className={styles['icon']} icon={arrowLineIcon}/>
	</div>;
}

export default memo(Select);
