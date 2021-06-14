import React, { memo, useCallback, useEffect, useState } from 'react';
import { map, update, each, isEmpty, isEqual } from 'lodash';
import { useSelector } from '@brickd/react';
import Collapse,{ Panel } from 'rc-collapse';
import {
  CategoryType,
  ComponentCategoryType,
  ComponentInfoType,
} from './CategoryTypes';
import DragAbleItem from './DragAbleItem';
import styles from './index.less';
import SearchBar from './SearchBar';
import { usePrevious } from '../../../utils';
import {arrowIcon} from '../../../assets';

function getFilterCategory(
  prevComponentsCategory: CategoryType,
  value?: string,
  rule?: string[],
) {
  const filterOpenKeys: string[] = [];
  const filterCategory: CategoryType = {};
  value = isEmpty(value) ? undefined : value;

  if (value && rule) {
    rule = rule.filter((name) => name.includes(value!));
  } else if (!value && !rule) {
    return { filterCategory: prevComponentsCategory, filterOpenKeys };
  }
  each(prevComponentsCategory, (infos, category) => {
    const { components } = infos || { components: null };
    if (components) {
      each(components, (componentInfo, componentName) => {
        if (
          (!rule && componentName.includes(value!)) ||
          (rule && rule.includes(componentName))
        ) {
          !filterOpenKeys.includes(category) && filterOpenKeys.push(category);
          update(
            filterCategory,
            `${category}.components`,
            (componentInfos = {}) => {
              componentInfos[componentName] = componentInfo;
              return componentInfos;
            },
          );
        }
      });
    } else if (
      (!rule && category.includes(value!)) ||
      (rule && rule.includes(category))
    ) {
      filterOpenKeys.push(category);
      filterCategory[category] = infos;
    }
  });
  return { filterOpenKeys, filterCategory };
}

/**
 * 搜索过滤回调
 */
// function searchFilter(inputValue: string, option: any) {
//   return option.props.children.toUpperCase().includes(inputValue.toUpperCase());
// }

/**
 * 渲染折叠Header
 */
function renderHeader(categoryName: string, isFold: boolean) {
  return (
    <div className={styles['fold-header']}>
      <img src={arrowIcon}
           className={isFold ? styles.rotate90 : ''}
           style={{
             marginLeft: '5px',
             marginRight: '5px',
             transition: 'all 0.2s',
           }}/>
      <span>{categoryName}</span>
    </div>
  );
}

/**
 * 渲染拖拽item
 */
function renderDragItem(
  key: string,
  componentName: string,
  defaultProps?: any,
) {
  return (
    <DragAbleItem key={key} dragSource={{ componentName, defaultProps }} />
  );
}

/**
 * 渲染分类组件中的组件
 * @param categoryInfo  分类信息
 * @param categoryName  分分类名字
 * @param isShow        是否展示分割分类组件名
 */
function renderContent(categoryInfo: ComponentInfoType, categoryName: string) {
  let items: any = null;
  if (!categoryInfo || isEmpty(categoryInfo.props || categoryInfo.components)) {
    items = renderDragItem(undefined, categoryName);
  } else {
    const { props, components } = categoryInfo;
    const renderItems = props || components;
    items = map(renderItems, (v: ComponentCategoryType | any, k) => {
      return renderDragItem(k, isNaN(Number(k)) ? k : categoryName, v);
    });
  }

  return (
    <div key={categoryName} className={styles['fold-content']}>
      {items}
    </div>
  );
}

export interface BrickPreviewPropsType {
  isShow?: boolean;
  componentsCategory: CategoryType;
}

function BrickPreview(props: BrickPreviewPropsType) {
  const { componentsCategory, isShow = true } = props;
  // const searchValues = flattenDeepArray(componentsCategory);
  const { selectedInfo } = useSelector(['selectedInfo']);
  const { childNodesRule } = selectedInfo || {};
  const [openKeys = [], setOpenKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [category, setCategory] = useState(componentsCategory);
  const prevIsShow = usePrevious(isShow);
  const prevChildNodesRule = usePrevious(childNodesRule);
  const prevCategory = usePrevious(category);
  useEffect(() => {
    if (
      isShow !== prevIsShow ||
      (isShow && !isEqual(prevChildNodesRule, childNodesRule))
    ) {
      const { filterOpenKeys, filterCategory } = getFilterCategory(
        componentsCategory,
        searchValue,
        childNodesRule,
      );
      if (!isEqual(filterCategory, prevCategory)) {
        setOpenKeys(filterOpenKeys);
        setCategory(filterCategory);
      }
    }
  }, [
    searchValue,
    prevIsShow,
    prevChildNodesRule,
    childNodesRule,
    prevCategory,
    isShow,
  ]);

  /**
   * 搜搜指定组件
   */
  const onChange = useCallback(
    (value: any) => {
      let filterOpenKeys: any[] = [],
        filterCategory = componentsCategory;
      if (isEmpty(value)) {
        if (childNodesRule) {
          ({ filterOpenKeys, filterCategory } = getFilterCategory(
            componentsCategory,
            undefined,
            childNodesRule,
          ));
        }
        setOpenKeys(filterOpenKeys);
        setCategory(filterCategory);
        setSearchValue(value);
      }
    },
    [childNodesRule],
  );

  /**
   * 搜索下拉框选中组件名称时的回调
   */
  // const onSelect = useCallback(
  //   (value: any) => {
  //     const { filterOpenKeys, filterCategory } = getFilterCategory(
  //       componentsCategory,
  //       value,
  //       childNodesRule,
  //     );
  //     setOpenKeys(filterOpenKeys);
  //     setSearchValue(value);
  //     setCategory(filterCategory);
  //   },
  //   [childNodesRule],
  // );

  return (
    <div className={styles['container']}>
      <SearchBar onChange={onChange}>
        <div className={styles['fold-container']}>
          {isEmpty(category) ? (
            <p style={{ textAlign: 'center' }}>为找到相关内容</p>
          ) : (
            <Collapse
              activeKey={openKeys}
              style={{ backgroundColor: '#fff',border: 0 }}
              onChange={(newOpenKeys: any) => setOpenKeys(newOpenKeys)}
            >
              {map(
                category,
                (categoryInfo: ComponentInfoType, categoryName) => {
                  const isFold = openKeys.includes(categoryName);
                  return (
                    <Panel
                        headerClass={styles['fold-panel-header']}
                      style={{ border: 0,padding:0 }}
                      header={renderHeader(categoryName, isFold)}
                      key={categoryName}
                      showArrow={false}
                    >
                      {renderContent(categoryInfo, categoryName)}
                    </Panel>
                  );
                },
              )}
            </Collapse>
          )}
        </div>
      </SearchBar>
    </div>
  );
}

export default memo<BrickPreviewPropsType>(
  BrickPreview,
  (prevProps, nextProps) => {
    const { isShow } = nextProps;
    /**
     * 当前组件不可见时 不触发组件渲染，相反触发渲染
     */
    return !isShow;
  },
);
