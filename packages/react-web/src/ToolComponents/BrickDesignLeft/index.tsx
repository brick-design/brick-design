import React, { memo, useCallback, useRef, useState } from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import BrickPreview, { BrickPreviewPropsType } from './BrickPreview';
import styles from './index.less';
import BrickTemplates from './BrickTemplates';
import DragAndResize, { DragAndResizeRefType } from '../../Components/DragAndResize';
import Icon from '../../Components/Icon';
import { moveIcon } from '../../assets';

type BrickDesignLeftProps = BrickPreviewPropsType;

function BrickDesignLeft(props: BrickDesignLeftProps) {
  const { componentsCategory } = props;
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
      right
      minWidth={212}
      className={`${styles['panel-container']} ${styles['left-container']}`}>
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
      <TabPane tab={'组件'} key={'1'}>
        <BrickPreview componentsCategory={componentsCategory} />
      </TabPane>
      <TabPane tab={'模板'} key={'2'}>
        <BrickTemplates />
      </TabPane>
    </Tabs>
    </DragAndResize>
  );
}

export default memo(BrickDesignLeft);
