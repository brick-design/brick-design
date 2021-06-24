import React, { memo, useCallback, useRef, useState } from 'react';
import Tabs,{TabPane} from 'rc-tabs';
import styles from './index.less';
import DragAndResize, { DragAndResizeRefType } from '../../Components/DragAndResize';
import Icon from '../../Components/Icon';
import { moveIcon } from '../../assets';

// interface BrickDesignRightProps {}

function BrickDesignRight() {
  const [activeKey, setActiveKey] = useState('1');
  const dragResizeRef=useRef<DragAndResizeRefType>();
  const onTabChange = (key) => {
    setActiveKey(key);
  };
  const onMoveStart=useCallback((event:React.MouseEvent)=>{
    dragResizeRef.current.onMoveStart(event);
  },[]);
  return (
    <DragAndResize
      ref={dragResizeRef}
      left
      minWidth={212}
      className={`${styles['panel-container']} ${styles['right-container']}`}>
      <div
        onMouseDown={onMoveStart}
        className={`${styles['drag-bar']} ${styles['tab-drag-bar']}`}
      />
      <Tabs
        className={styles['brickd-tabs']}
        style={{ border: 0 }}
        activeKey={activeKey}
        tabBarStyle={{ height: 39 }}
        tabBarGutter={16}
        tabBarExtraContent={
          <Icon
            icon={moveIcon}
            className={styles['icon-container']}
            iconClass={styles['icon-class']}
          />
        }
        onChange={onTabChange}
      >

        <TabPane tab={'设计'} key={'1'}/>
        <TabPane tab={'属性'} key={'2'}/>
        <TabPane tab={'高级'} key={'3'}/>
      </Tabs>
    </DragAndResize>
  );
}

export default memo(BrickDesignRight);
