import React,{memo} from 'react';
import SelectDialog, { SelectDialogProps } from './SelectDialog';


type SelectProps = SelectDialogProps

function Select(props:SelectProps){
	const {value,...rest}=props;
	return <div>
<span>value</span>
<SelectDialog {...rest} value={value}/>
	</div>;
}

export default memo(Select);
