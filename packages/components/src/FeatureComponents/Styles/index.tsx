import React, { memo,  } from 'react';
// import Tabs,{TabPane} from 'rc-tabs';
import { PageConfigType, useSelector,getSelector } from '@brickd/canvas';
import {get} from 'lodash';
import styles from './index.less';
import StylePanel from './StylePanel';
import DragResizeBar from '../../Components/DragResizeBar';
import { stylesIcon } from '../../assets';
// import { getCssClassProps } from '../../utils';

// const defaultCss={
// 	className: {
// 		type: PROPS_TYPES.cssClass,
// 	},
// 	style:{
// 		type: PROPS_TYPES.style,
// 	},
// };

function Styles(){
	const {selectedInfo}=useSelector(['selectedInfo']);
	const selectedKey=get(selectedInfo,'selectedKey');
	const {pageConfig}=getSelector<{pageConfig:PageConfigType}>(['pageConfig']);
	const {props}=get(pageConfig,selectedKey)||{};
	// const {propsConfig}=getComponentConfig(componentName);

	// const [activeKey,setActiveKey]=useState();
	// let cssClassConfig= getCssClassProps(propsConfig);
	// cssClassConfig={...cssClassConfig,...defaultCss};
	// const onTabChange=(key)=>{
	// 	setActiveKey(key);
	// };
	return <DragResizeBar title={'Styles'}
												className={styles['container']}
												minWidth={400}
												minHeight={700}
												defaultShow
												barStyle={{borderBottom:'1px #f2f2f2 solid'}}
												icon={stylesIcon}>
		{/*<Tabs*/}
		{/*	tabPosition='left'*/}
		{/*	className={styles['tabs']}*/}
		{/*	style={{ border: 0,display:'flex',flex:1}}*/}
		{/*	activeKey={activeKey}*/}
		{/*	tabBarStyle={{ display:'flex',fontSize:12 }}*/}
		{/*	onChange={onTabChange}*/}
		{/*>*/}
		{/*	{map(cssClassConfig,(config,propName)=>*/}
		{/*		(<TabPane tab={propName} key={propName}>*/}
		{/*			<StylePanel style={get(props,propName)} />*/}
		{/*		</TabPane>)*/}
		{/*	)}*/}
		{/*</Tabs>*/}
		<StylePanel style={get(props,'style')} />

	</DragResizeBar>;
}

export default memo(Styles);
