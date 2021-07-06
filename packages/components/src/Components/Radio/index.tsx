import React,{memo} from 'react';
import {map} from 'lodash';
import Icon,{ IconProps }  from '../Icon';

interface RadioType extends IconProps{
	onChange?:(value:any)=>void
	targetValue?:string
	value?:string
	selectedStyle?:React.CSSProperties
	unselectedStyle?:React.CSSProperties
	selectedIcon?:string
	unselectedIcon?:string
}
function Radio(props:RadioType){
	const {onChange,targetValue,value,selectedStyle,unselectedStyle,selectedIcon,unselectedIcon,...rest}=props;
	const onClick=()=>{
		onChange&&onChange(value?targetValue:undefined);
	};
	const isSelected=targetValue===value;
	return <Icon onClick={onClick}
							 style={isSelected?selectedStyle:unselectedStyle}
							 {...rest}
							 icon={isSelected?selectedIcon:unselectedIcon}
							/>;
}

interface RadioGroupProp extends RadioType{
	radioData:RadioType[];
}

function RadioGroup(props:RadioGroupProp){
	const {radioData,...rest}=props;

	return map(radioData,(v)=>{
		const {value,...radoRest}=v;
		return <Radio targetValue={value} {...radoRest}  {...rest} key={value}/>;
	});
}
Radio.RadioGroup=RadioGroup;

export default memo(Radio);
