import React, { useEffect, useRef, useState } from 'react';
import map from 'lodash/map';
import styles from '../style.less';
import { Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import get from 'lodash/get';
import { ACTION_TYPES } from '@/models';

interface ContextMenuPropsType {
  dispatch: Dispatch,
  isSelected: boolean,
  enableMenu: string[],
}

const menuMap={
  copy:ACTION_TYPES.copyComponent,
  clear:ACTION_TYPES.clearChildNodes,
  delete:ACTION_TYPES.deleteComponent
}

type MenuType='copy'|'clear'|'delete'

function ContextMenu(props: ContextMenuPropsType) {
  const { isSelected, enableMenu,dispatch } = props;
  const root: React.RefObject<any> = useRef(null);
  const [visible, setVisible] = useState(isSelected);

  useEffect(() => {
    function handleContextMenu(event: any) {
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
        dom.style.left = `${clientX}px`;
      }
      if (left) {
        dom.style.left = `${clientX - offsetWidth}px`;
      }

      if (bottom) {
        dom.style.top = `${clientY}px`;
      }
      if (top) {
        dom.style.top = `${clientY - offsetHeight}px`;
      }
    }
    addEventListener('contextmenu', handleContextMenu);
    return () => removeEventListener('contextmenu', handleContextMenu);
  },[isSelected,visible]);

  useEffect(() => {
    function handleClick() {
      if (visible) {
        setVisible(false);
      }
    }
    addEventListener('click', handleClick);
    return () => removeEventListener('click', handleClick);

  }, [visible]);

  if(!visible) return null
  return (
      <div ref={root} className={styles['contextMenu-wrap']}>
        {map(enableMenu, (menu:MenuType, key) => <div
          onClick={()=>dispatch({type:menuMap[menu]})}
          key={key}
          className={styles['contextMenu-option']}>{formatMessage({ id: `BLOCK_NAME.toolBar.${menu}` })}</div>,
        )}

      </div>
  );
}

export default ContextMenu;
