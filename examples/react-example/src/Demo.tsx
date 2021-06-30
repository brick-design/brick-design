import React from 'react'
import styles from './index.less';
interface DemoProps extends React.HTMLProps<HTMLDivElement>{
	subClassName0?:string
	subClassName1?:string

}
function Demo(props:DemoProps){
	const {className,subClassName0,subClassName1}=props
	return <div className={`${styles['demo-container']} ${className}`}>
		<div className={`${styles['demo-container0']} ${subClassName0}`}/>
		<div className={`${styles['demo-container1']} ${subClassName1}`}/>
	</div>
}

export default Demo
