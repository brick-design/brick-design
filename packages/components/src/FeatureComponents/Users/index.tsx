import React, { memo } from 'react';
import {map} from 'lodash';
import styles from './index.less';
import Avatar from '../../Components/Avatar';

export type UserType={
	id:string|number
	img:string
}

interface UsersProps extends React.HTMLProps<HTMLDivElement>{
	users:UserType[]
}

const colors=['#FF7F50','#6495ED','#DC143C','#9932CC'];

function Users(props:UsersProps){
	const {users,...rest}=props;
	return <div className={styles['container']} {...rest}>
		{map(users,(user,index)=>{
			const {id,img}=user;
			return <Avatar style={{borderColor:colors[index]}} className={styles['icon']} icon={img} key={id}/>;
		})}
	</div>;
}
export default memo(Users);
