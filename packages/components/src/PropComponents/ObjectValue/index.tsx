import React,{memo} from 'react';
import Form, { Field } from 'rc-field-form';
import {map} from 'lodash';
import { FieldProps } from 'rc-field-form/es/Field';
import styles from './index.less';
import CommonArray from '../CommonArray';
import { CodeEditor, Input, InputNumber, Radio } from '../../Components';

interface ObjectValueProps{
	value?:any
}

export interface FormItemProps extends FieldProps{
	value?:any
}

function FieldItem({name,value, ...restProps }:FormItemProps){
	let   renderItem=<div/>;
	if(typeof value==='string'){
		renderItem=<Input/>;
	}else if(typeof value==='number'){
		renderItem=<InputNumber/>;
	}else if(typeof value==='boolean'){
		renderItem=<Radio/>;
	}else if(value instanceof Array&&value.some((v)=> typeof v==='string')){
		renderItem=<CommonArray/>;
	}else if(value instanceof Array&&value.some((v)=> typeof v==='number')){
		renderItem=<CommonArray isNumber/>;
	}else if(value instanceof Array&&value.some((v)=> typeof v==='object')||typeof value==='object'){
		renderItem=<CodeEditor/>;
	}

	return  <div className={styles['Item-container']}>
		<span>{name}</span>
		<Field {...restProps}>
		{renderItem}
	</Field>
	</div>;
}

function ObjectValue(props:ObjectValueProps){
	const {value}=props;


	return <Form>
		{map(value,(item,key)=><FieldItem name={key} key={key} value={item}/>)}
	</Form>;
}

export default memo(ObjectValue);
