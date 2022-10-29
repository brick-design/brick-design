import React, {
  forwardRef,
  memo,
  Ref,
  useImperativeHandle,
  useState,
} from 'react';
import { map, each } from 'lodash';
import styles from './index.less';
import DragAbleItem from './DragAbleItem';

export interface ComponentDescType {
  desc?: string;
  img?: string;
  props?: any;
}
export interface CategoryInfoType {
  [componentName: string]: null | ComponentDescType[];
}
export interface CategoryType {
  [category: string]: CategoryInfoType;
}

interface SearchResultProp {
  componentsCategory: CategoryType;
  style?: React.CSSProperties;
}

/**
 * 渲染拖拽item
 */
export function renderDragItem(
  componentInfos: ComponentDescType[] | null,
  componentName: string,
) {
  if (componentInfos) {
    return map(componentInfos, (info, index) => {
      const { props, img, desc } = info;
      return (
        <DragAbleItem
          key={componentName + index}
          img={img}
          desc={desc}
          dragSource={{ componentName, defaultProps: props }}
        />
      );
    });
  }
  return <DragAbleItem key={componentName} dragSource={{ componentName }} />;
}

export interface SearchRefType {
  changeSearch: (v: string) => void;
}

function SearchResult(props: SearchResultProp, ref: Ref<SearchRefType>) {
  const { componentsCategory, style } = props;
  const [searchResult, setSearchResult] = useState<CategoryInfoType>();

  useImperativeHandle(ref, () => ({
    changeSearch,
  }));

  const changeSearch = (v: string) => {
    const result = {};
    each(componentsCategory, (categoryInfo) => {
      each(categoryInfo, (componentInfo, componentName) => {
        if (componentName.includes(v)) {
          result[componentName] = componentInfo;
        } else {
          each(componentInfo, (info) => {
            const { desc } = info;
            if (desc && desc.includes(v)) {
              if (!result[componentName]) {
                result[componentName] = [info];
              } else {
                result[componentName].push(info);
              }
            }
          });
        }
      });
    });

    setSearchResult(result);
  };

  return (
    <div style={style} className={styles['result-container']}>
      <div className={styles['item-container']}>
        {map(searchResult, renderDragItem)}
      </div>
    </div>
  );
}

export default memo(forwardRef(SearchResult));
