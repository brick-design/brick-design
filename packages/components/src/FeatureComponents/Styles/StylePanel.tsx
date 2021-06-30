import React,{memo} from 'react';
import Form, { Field } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';
import { styleCategory } from './stylesConfig';
import styles from './index.less';
import { NCollapse } from '../../Components';

interface StylePanelProps{
	style:React.CSSProperties
}

type ItemProps = FieldProps

function renderItem(props:ItemProps,name:string){
	const {...rest}=props;
	return <Field {...rest}>
		<div>{name}</div>
	</Field>;
}

function renderHeader(category:string,isFold:boolean){

	return <div className={styles['style-header']}>
		{category}

	</div>;
}
function StylePanel(props:StylePanelProps){
	const {style}=props;
	return <Form className={styles['form-container']} initialValues={style}>
		<NCollapse
			collapseClass={styles['collapse-class']}
			headerClass={styles['collapse-header']}
			className={styles['collapse-container']}
			header={renderHeader}
			renderItem={renderItem}
			categories={styleCategory}
		/>
	</Form>;
}

export default memo(StylePanel);
