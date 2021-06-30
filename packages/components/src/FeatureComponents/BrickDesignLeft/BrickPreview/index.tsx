import React, { memo, useCallback, useRef, useState } from 'react';
import styles from './index.less';
import SearchResult, {
  CategoryType,
  renderDragItem,
  SearchRefType,
} from './SearchResult';
import SearchBar from '../Components/SearchBar';
import { arrowIcon } from '../../../assets';
import { NCollapse } from '../../../Components';

/**
 * 渲染折叠Header
 */
function renderHeader(categoryName: string, isFold: boolean) {
  return (
    <div className={styles['fold-header']}>
      <img
        src={arrowIcon}
        className={isFold ? styles.rotate90 : ''}
        style={{
          marginLeft: '5px',
          marginRight: '5px',
          transition: 'all 0.2s',
        }}
      />
      <span>{categoryName}</span>
    </div>
  );
}

export interface BrickPreviewPropsType {
  componentsCategory: CategoryType;
}

function BrickPreview(props: BrickPreviewPropsType) {
  const { componentsCategory } = props;
  const searchRef = useRef<SearchRefType>();
  const [isShowSearch, setIsShowSearch] = useState(false);
  /**
   * 搜搜指定组件
   */
  const onChange = useCallback(
    (value: any) => {
      if (value) {
        if (!isShowSearch) {
          setIsShowSearch(true);
        }
        searchRef.current.changeSearch(value);
      } else if (isShowSearch) {
        setIsShowSearch(false);
      }
    },
    [setIsShowSearch, isShowSearch],
  );

  return (
    <div className={styles['container']}>
      <SearchBar onChange={onChange}>
        <NCollapse
          style={{ display: !isShowSearch ? 'flex' : 'none' }}
          className={styles['fold-container']}
          collapseClass={styles['collapse-class']}
          header={renderHeader}
          renderItem={renderDragItem}
          categories={componentsCategory}
        />
        <SearchResult
          componentsCategory={componentsCategory}
          ref={searchRef}
          style={{ display: isShowSearch ? 'block' : 'none' }}
        />
      </SearchBar>
    </div>
  );
}

export default memo<BrickPreviewPropsType>(BrickPreview);
