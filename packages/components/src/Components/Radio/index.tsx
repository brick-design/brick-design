import React from 'react';
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
	radioData:string[];
}

function RadioGroup(props:RadioGroupProp){
	const {radioData,...rest}=props;

	return <div>
		{map(radioData,(v)=>{
			return <Radio targetValue={v}  {...rest} key={v}/>;
		})}
	</div>;
}
Radio.RadioGroup=RadioGroup;

export default Radio;
