import React, { memo,  useState } from 'react';
import styles from '../index.less';
import { Icon } from '@/modules/designPanel/components';
import { VirtualDOMType,getDragSource } from '@/store';

interface ListItemPropsType {
  item: { vDOM: VirtualDOMType },
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
  const { itemData, previewImg, deleteItem, item } = props;
  return (
    <div draggable
         //todo
         // onDragStart={()=> getDragSource(item)}
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
