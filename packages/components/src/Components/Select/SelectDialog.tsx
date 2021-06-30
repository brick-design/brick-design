import React,{memo} from 'react';
import {map} from 'lodash';

type OptionProps={
	data:any
	onSelect?:(v:any)=>void
}
function Option(props:OptionProps){
	const {data,onSelect}=props;
	const onClick=()=>{
		onSelect&&onSelect(data);
	};
	return <div onClick={onClick}>

	</div>;
}

export interface SelectDialogProps extends React.HtmlHTMLAttributes<HTMLDivElement>{
	selectData?:[]
	onChange?:(v:any)=>void
	value?:any
}

function SelectDialog(props:SelectDialogProps){
	const {selectData,onChange,value,...rest}=props;

	return <div {...rest}>
		{map(selectData,(data,key)=>{
			return <Option onSelect={onChange} data={data} key={key}/>;
		})}
	</div>;
}

export default memo(SelectDialog);
