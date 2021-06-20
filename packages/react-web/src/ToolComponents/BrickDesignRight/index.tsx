import React, {memo, useState} from 'react';
import NTabs, { TabPane } from '../../Components/NTabs';
import styles from './index.less';

interface BrickDesignRightProps{

}

function BrickDesignRight(props:BrickDesignRightProps){
	const [activeKey,setActiveKey]=useState('1');

	const onTabChange=(key)=>{
		setActiveKey(key);
	};

	return <NTabs left
								minWidth={212}
								resizeClassName={styles['right-container']}
								className={styles['brickd-right-tabs']}
								style={{border:0}}
								activeKey={activeKey}
								tabBarStyle={{height:39}}
								tabBarGutter={16}
								onChange={onTabChange}
	>

		<TabPane tab={'设计'} key={'1'}>
		</TabPane>
		<TabPane tab={'属性'} key={'2'}>
		</TabPane>
		<TabPane tab={'高级'} key={'3'}>
		</TabPane>
	</NTabs>;
}

export default memo(BrickDesignRight);
