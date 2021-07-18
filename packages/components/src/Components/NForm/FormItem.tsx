import React, { memo, useState } from 'react';
import {Field} from "rc-field-form";
import { FieldProps } from 'rc-field-form/es/Field';
import styles from './index.less';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import Dropdown from '../Dropdown';
import { moreIcon } from '../../assets';

export interface FormItemProps{
    isShowLabel?:string
    renderFormItem?:(v:any,k:string,isExpression?:boolean,menu?:string)=>any
    config?:any
}


function FormItem(props:FormItemProps&FieldProps){
    const {name,isShowLabel=true,renderFormItem,config,...rest}=props;
    const [isExpression,setIsExpression]=useState(false);
    const [menu,setMenu]=useState<string>();
    const {style,renderComponent,menus,isHidden,headerStyle}=renderFormItem(config,name as string,isExpression,menu);
    return <div style={style} className={styles['form-item-container']}>
        {isShowLabel&&<div style={headerStyle} className={styles['title']}>
            <span className={styles['label']}>{name}</span>
            <div className={styles['handle-container']}>
                {!isHidden&&<Checkbox onChange={(v)=>setIsExpression(v)}
                  className={`${styles['icon-none']} ${styles['icon-flex']}`}/>}
            {!!menus&&<Dropdown className={styles['drop-down']} setMenu={setMenu} menus={menus}>
                <Icon icon={moreIcon}/>
            </Dropdown>}
            </div>

        </div>}
        <Field  name={name} {...rest}>
            {(control) =>React.cloneElement(renderComponent, { ...control })}
        </Field>
    </div>;
}

export default memo(FormItem);
