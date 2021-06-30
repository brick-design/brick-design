import React,{memo} from 'react';
import {map} from 'lodash';
import Icon,{ IconProps }  from '../Icon';

interface RadioType extends IconProps{
	onChange?:(value:any)=>void
	targetValue?:string
	value?:string
	selectedStyle?:React.CSSProperties
	unselectedStyle?:React.CSSProperties
}
function Radio(props:RadioType){
	const {onChange,targetValue,value,selectedStyle,unselectedStyle,...rest}=props;
	const onClick=()=>{
		onChange&&onChange(value?targetValue:undefined);
	};
	return <Icon onClick={onClick} style={targetValue===value?selectedStyle:unselectedStyle} {...rest}/>;
}

interface RadioGroupProp extends RadioType{
	radioData:[];
}

function RadioGroup(props:RadioGroupProp){
	const {radioData,...rest}=props;

	return map(radioData,(v)=>{
		return <Radio targetValue={v}  {...rest} key={v}/>;
	});
}
Radio.RadioGroup=RadioGroup;

export default memo(Radio);
