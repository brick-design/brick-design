import React, { memo, useCallback, useRef, useState } from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import styles from './index.less';
import DragAndResize, {
  DragAndResizeRefType,
  DragAndResizeProp,
} from '../DragAndResize';
import Icon from '../Icon';
import { closeIcon } from '../../assets';
import BarButton, { BarButtonProps, BarButtonRefType } from '../BarButton';

interface BarTabsProp
  extends DragAndResizeProp,
    Omit<BarButtonProps, 'dragResizeRef' | 'children'> {}
function BarTabs(props: BarTabsProp) {
  const { icon, children, className, ...rest } = props;
  const [activeKey, setActiveKey] = useState('1');
  const dragResizeRef = useRef<DragAndResizeRefType>();
  const barButtonRef = useRef<BarButtonRefType>();

  const onClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    barButtonRef.current.closePanel();
  }, []);
  const onTabChange = (key) => {
    setActiveKey(key);
  };
  const onMoveStart = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    dragResizeRef.current.onMoveStart(event);
  }, []);

  return (
    <BarButton icon={icon} dragResizeRef={dragResizeRef} ref={barButtonRef}>
      <DragAndResize
        minWidth={212}
        {...rest}
        onWheel={(event) => event.stopPropagation()}
        ref={dragResizeRef}
        className={`${styles['panel-container']} ${className}`}
      >
        <div onMouseDown={onMoveStart} className={styles['tab-drag-bar']} />
        <Tabs
          className={styles['brickd-tabs']}
          style={{ border: 0 }}
          activeKey={activeKey}
          tabBarStyle={{ height: 39 }}
          tabBarGutter={16}
          tabBarExtraContent={
            <Icon
              onClick={onClick}
              icon={closeIcon}
              className={styles['icon-container']}
              iconClass={styles['icon-class']}
            />
          }
          onChange={onTabChange}
        >
          {children}
        </Tabs>
      </DragAndResize>
    </BarButton>
  );
}
export { TabPane };
export default memo(BarTabs);
