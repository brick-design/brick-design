import React,{memo} from 'react';
import styles from './index.less';

interface IconProps extends React.AllHTMLAttributes<any>{
    icon?:string
    iconClass?:string
}
function Icon(props:IconProps){
    const {onClick,icon,iconClass,className}=props;
    return<div className={`${styles['container']} ${className}`} onClick={onClick}>
        <img className={iconClass} src={icon}/>
    </div>;
}
export default memo(Icon);
