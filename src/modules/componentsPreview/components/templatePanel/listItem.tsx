import React, { memo, useCallback, useState } from 'react';
import styles from '../index.less';
import { Icon } from '@/components';
import { ACTION_TYPES } from '@/models';
import { Dispatch } from 'redux';
import { VirtualDOMType } from '@/types/ModelType';

interface ListItemPropsType {
  dispatch: Dispatch,
  item: { templateData: VirtualDOMType },
  itemData: {
    img: string,
    id: string,
    name: string
  },
  previewImg: (img: string) => void,
  deleteItem: (id: string) => void

}


function ListItem(props: ListItemPropsType) {
  const [hovered, setHovered] = useState(false);
  const { itemData, previewImg, deleteItem, item, dispatch } = props;
  return (
    <div draggable
         onDragStart={useCallback(() => dispatch({
           type: ACTION_TYPES.getDragData,
           payload: {
             dragData: item,
           },
         }), [])}
         className={styles['list-item']}>
      <div onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
           className={styles['list-handler']}>
        <img style={{ width: '100%', height: '100%' }} src={itemData.img}/>
        <div style={{ visibility: hovered ? 'visible' : 'hidden' }} className={styles['list-shade']}>
          <Icon type={'eye'} onClick={() => previewImg(itemData.img)}/>
          <Icon type={'delete'} onClick={() => deleteItem(itemData.id)}/>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '20px', clear: 'both' }}>{itemData.name}</p>
    </div>
  );
}

export default memo(ListItem, () => true);
