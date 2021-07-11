import React,{memo} from 'react';
import { Input } from '../../Components';

interface ExpressionProps{
	onChange?:(s:string)=>void
	value?:string
}
	function Expression(props:ExpressionProps){
	const {onChange,value}=props;
	const onInputChange=(v)=>{
		onChange&&onChange(v?`{{${v}}}`:undefined);
	};
	const newValue=value;

	return <div>
		<span>{'{{'}</span>
		<Input  onChange={onInputChange} value={newValue} placeholder={'请输入js表达式'}/>
		<span>{'}}'}</span>
	</div>;
}

export default memo(Expression);
