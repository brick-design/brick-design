import React, {memo, useState} from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import BrickPreview, {BrickPreviewPropsType} from './BrickPreview';
import Layers from './Layers';
import styles from './index.less';
import Resizeable from "../../Components/Resizeable";

require('rc-tabs/assets/index.css');
require('rc-collapse/assets/index.css');

type BrickDesignLeftProps = BrickPreviewPropsType

function BrickDesignLeft(props:BrickDesignLeftProps){
    const {componentsCategory}=props;
    const [activeKey,setActiveKey]=useState('1');

    const onTabChange=(key)=>{
        setActiveKey(key);
    };

    return <Resizeable right minWidth={212} className={styles['container']}>
    <Tabs
        className={styles['brickd-left-tabs']}
        style={{border:0}}
        activeKey={activeKey}
        tabBarStyle={{height:39}}
        tabBarGutter={16}

        onChange={onTabChange}
    >
        <TabPane tab={'图层'} key={'1'}>
            <Layers/>
        </TabPane>
        <TabPane tab={'组件'} key={'2'}>
            <BrickPreview componentsCategory={componentsCategory}/>
        </TabPane>
        <TabPane tab={'模板'} key={'3'}>
            <BrickPreview componentsCategory={componentsCategory}/>
        </TabPane>
    </Tabs>
    </Resizeable>;
}

export default memo(BrickDesignLeft);
