import React,{memo} from 'react';

function Select(props:React.HTMLProps<HTMLSelectElement>){
	const {value,...rest}=props;
	return <select {...rest}>
<option>value</option>
	</select>;
}

export default memo(Select);
