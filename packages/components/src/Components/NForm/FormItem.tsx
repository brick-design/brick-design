import React,{memo} from 'react';
import {Field} from "rc-field-form";
import { FieldProps } from 'rc-field-form/es/Field';
import styles from './index.less';

export interface FormItemProps{
    isShowLabel?:string
    renderFormItem?:(v:any,k:string)=>any
    config?:any
}


function FormItem(props:FormItemProps&FieldProps){
    const {name,isShowLabel=true,renderFormItem,config,...rest}=props;
    const {style,renderComponent}=renderFormItem(config,name as string);
    return <div style={style} className={styles['form-item-container']}>
        {isShowLabel&&<span className={styles['label']}>{name}</span>}
        <Field name={name} {...rest}>
            {(control) =>React.cloneElement(renderComponent, { ...control })}
        </Field>
    </div>;
}

export default memo(FormItem);
