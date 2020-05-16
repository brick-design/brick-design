import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from '@/modules/toolBar/style.less';
import { Icon } from '@/modules/designPanel/components';
import map from 'lodash/map';
import { PlatformMenusType } from '@/modules/toolBar/config';
import {changePlatform, PlatformInfoType} from 'brickd-core';

interface SwitchPlatformPropsType {
  platformInfo?: PlatformInfoType,
  menus: PlatformMenusType
}

const MenuItem = Menu.Item;

function SwitchPlatform(props: SwitchPlatformPropsType) {
  const { menus} = props;
  const [isMobile, setIsMobile] = useState(false);
  const [mobileModel, setMobileModel] = useState(Object.keys(menus)[0]);
  const [isVertical, setIsVertical] = useState(true);

  useEffect(() => {
    const size = isMobile ? [...menus[mobileModel]] : ['100%', '100%'];
    !isVertical && (size.reverse());
    changePlatform({
      isMobile,
      size,
    })

  }, [isMobile, isVertical, mobileModel]);

  const renderMenu = useCallback(() => {
    return (<Menu selectedKeys={[mobileModel]} onClick={({ key }: any) => setMobileModel(key)}>
      {map(menus, (_, key) => {
        return (<MenuItem key={key}>{key}</MenuItem>);
      })}
    </Menu>);
  }, [mobileModel]);

  const dropProps = isMobile ? {} : { visible: false };
  return (
    <div className={styles['switch-container']}>
      <Dropdown overlay={useMemo(() => renderMenu(), [mobileModel])} {...dropProps} trigger={['hover']}>
        <div
          className={styles['switch-platform']}
          onClick={() => setIsMobile(!isMobile)}
        >
          <Icon style={{ fontSize: 18 }} type={isMobile ? 'android' : 'windows'}/>
          <span>{isMobile ? 'mobile' : 'PC'}</span>
        </div>
      </Dropdown>
      {isMobile && <Icon onClick={() => setIsVertical(!isVertical)} style={{ fontSize: 20 }} type={'sync'}/>}
    </div>
  );

}

export default SwitchPlatform;
