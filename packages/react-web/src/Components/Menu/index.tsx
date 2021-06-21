import React, { memo } from 'react';
import { map } from 'lodash';
import styles from './index.less';
export type MenuDataType = {
  menuName: string;
  onClick?: () => void;
};
interface MenuItemProps {
  menuData: MenuDataType;
}
function MenuItem(props: MenuItemProps) {
  const {
    menuData: { menuName, onClick },
  } = props;
  return (
    <div className={styles['menu-item']} onClick={onClick || undefined}>
      {menuName}
    </div>
  );
}

interface MenuProp {
  menus?: MenuDataType[];
}
function Menu(props: MenuProp) {
  const { menus } = props;
  return (
    <div className={styles['menu-container']}>
      {map(menus, (menuData, index) => (
        <MenuItem menuData={menuData} key={index} />
      ))}
    </div>
  );
}

export default memo(Menu);
