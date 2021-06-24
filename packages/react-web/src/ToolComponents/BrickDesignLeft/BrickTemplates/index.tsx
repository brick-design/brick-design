import React, { memo, useCallback, useState } from 'react';
import { map } from 'lodash';
import styles from './index.less';
import DragAbleItem, { TemplateType } from './DragAbleItem';
import SearchBar from '../Components/SearchBar';

export function renderDragItem(item: TemplateType) {
  const { id } = item;
  return <DragAbleItem key={id} item={item} />;
}

const initData: TemplateType[] = [
  {
    desc: '哈哈哈',
    id: '1',
    img:
      'https://img1.baidu.com/it/u=453001413,951045025&fm=224&fmt=auto&gp=0.jpg',
    template: {0:{componentName:'img',props:{src:'https://img1.baidu.com/it/u=453001413,951045025&fm=224&fmt=auto&gp=0.jpg'}}},
  },
  {
    desc: '呵呵呵',
    id: '2',
    img: 'https://t7.baidu.com/it/u=3930750564,2979238085&fm=193&f=GIF',
    template: {0:{componentName:'img',props:{src:'https://t7.baidu.com/it/u=3930750564,2979238085&fm=193&f=GIF'}}},

  },
  {
    desc: '嘿嘿嘿',
    id: '3',
    img: 'https://t7.baidu.com/it/u=3522949495,3570538969&fm=193&f=GIF',
    template: {0:{componentName:'img',props:{src:'https://t7.baidu.com/it/u=3522949495,3570538969&fm=193&f=GIF'}}},
  },
  {
    desc: '啦啦啦',
    id: '4',
    img: 'https://t7.baidu.com/it/u=2878377037,2986969897&fm=193&f=GIF',
    template: {0:{componentName:'img',props:{src:'https://t7.baidu.com/it/u=2878377037,2986969897&fm=193&f=GIF'}}},
  },
  {
    desc: '嚯嚯嚯',
    id: '5',
    img: 'https://t7.baidu.com/it/u=3038817810,32670274&fm=193&f=GIF',
    template: {0:{componentName:'img',props:{src:'https://t7.baidu.com/it/u=3038817810,32670274&fm=193&f=GIF'}}},
  },
];

// export interface BrickTemplatesPropsType {}

function BrickTemplates() {
  const [data, setData] = useState(initData);
  /**
   * 搜搜指定组件
   */
  const onChange = useCallback(
    () => {
      setData([]);
    },
    [data, setData],
  );

  return (
    <div className={styles['template-container']}>
      <SearchBar onChange={onChange}>
        <div className={styles['result-container']}>
          <div className={styles['item-container']}>
            {map(data, renderDragItem)}
          </div>
        </div>
      </SearchBar>
    </div>
  );
}

export default memo(BrickTemplates);
