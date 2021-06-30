import React,{memo} from 'react';
import Input from '../Input';

interface InputNumberProps{
	onChange:(v?:number)=>void
}

function InputNumber (props:InputNumberProps){
	const {...rest}=props;

	return <Input closeAble={false} type={'number'} {...rest}/>;
}

export default memo(InputNumber);
