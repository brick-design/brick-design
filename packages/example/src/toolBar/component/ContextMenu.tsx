import React, { useEffect, useRef, useState } from 'react';
import map from 'lodash/map';
import styles from '../style.less';
import { clearChildNodes, copyComponent, deleteComponent } from '../../../../core';

interface ContextMenuPropsType {
  isSelected: boolean,
  enableMenu: string[],
}

const menuMap = {
  copy: copyComponent,
  clear: clearChildNodes,
  delete: deleteComponent,
};

type MenuType = 'copy' | 'clear' | 'delete'

function ContextMenu(props: ContextMenuPropsType) {
  const { isSelected, enableMenu } = props;
  const root: React.RefObject<any> = useRef(null);
  const [visible, setVisible] = useState(isSelected);


  useEffect(() => {
    const iframe: any = document.getElementById('dnd-iframe');

    function handleContextMenu(event: any) {
      const { x, y } = iframe.getBoundingClientRect();
      if (!isSelected) return;
      event.preventDefault();

      setVisible(true);
      const dom = root.current;
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = dom;
      const right = (innerWidth - clientX) > offsetWidth;
      const left = !right;
      const bottom = (innerHeight - clientY) > offsetHeight;
      const top = !bottom;
      if (right) {
        dom.style.left = `${clientX + x}px`;
      }
      if (left) {
        dom.style.left = `${clientX - offsetWidth + x}px`;
      }

      if (bottom) {
        dom.style.top = `${clientY + y}px`;
      }
      if (top) {
        dom.style.top = `${clientY - offsetHeight + y}px`;
      }
    }

    function handleClick() {
      if (visible) {
        setVisible(false);
      }
    }

    iframe?.contentWindow.addEventListener('click', handleClick);
    window.addEventListener('click', handleClick);
    iframe?.contentWindow.addEventListener('contextmenu', handleContextMenu);
    return () => {
      iframe?.contentWindow.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      iframe?.contentWindow.removeEventListener('click', handleClick);
    };
  }, [isSelected, visible]);

  if (!isSelected && visible) setVisible(false);
  if (!visible) return null;
  return (
    <div ref={root} className={styles['contextMenu-wrap']}>
      {map(enableMenu, (menu: MenuType, key) => <div
        onClick={menuMap[menu]}
        key={key}
        className={styles['contextMenu-option']}>{menu}</div>,
      )}

    </div>
  );
}

export default ContextMenu;
