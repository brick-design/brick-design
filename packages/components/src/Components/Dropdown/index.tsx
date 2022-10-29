import React, { memo, useState } from 'react';
import { map } from 'lodash';
import styles from './index.less';

interface DropdownProps extends React.HTMLProps<HTMLDivElement> {
  menus: string[];
  setMenu?: (menu: string) => void;
}
function Dropdown(props: DropdownProps) {
  const { children, menus, setMenu, className, ...rest } = props;
  const [selectedMenu, setSelectedMenu] = useState();
  const onSelect = (event: React.MouseEvent, menu: any) => {
    event.stopPropagation();
    setMenu && setMenu(menu);
    setSelectedMenu(menu);
  };

  return (
    <div className={`${styles['container']} ${className}`} {...rest}>
      {children}
      <div className={`${styles['drop-dialog']} ${styles['show-dialog']}`}>
        {map(menus, (menu, index) => {
          const isSelected = selectedMenu === menu;
          const isLast = menu.length - 1 === index;
          return (
            <div
              onClick={(event) => onSelect(event, menu)}
              key={menu}
              className={`${styles['menu']} ${
                isSelected && styles['selected']
              } ${isLast && styles['isLast']}`}
            >
              {menu}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Dropdown);
