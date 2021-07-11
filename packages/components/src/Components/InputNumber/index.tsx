import React,{memo} from 'react';
import styles from './index.less';

type InputNumberProps = React.HTMLProps<HTMLInputElement>

function InputNumber (props:InputNumberProps){
	const {...rest}=props;

	return <input className={styles['input-number']}
								defaultValue={0}
								type={'number'}
								{...rest}/>;
}

export default memo(InputNumber);
