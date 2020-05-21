import React, { memo, useCallback, useEffect, useState } from 'react';
import { AutoComplete, Col, Collapse, Divider, Icon, Input, Row } from 'antd';
import map from 'lodash/map';
import update from 'lodash/update';
import each from 'lodash/each';
import styles from './index.less';
import DragAbleItem from './DragAbleItem';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { CategoryType, ComponentCategoryType, ComponentInfoType, useSelector } from 'brickd-core';
import { flattenDeepArray, usePrevious } from '../utils';

const { Panel } = Collapse;
/**
 * 获取过滤后的组件配置信息
 * @param prevComponentsCategory
 * @param value 搜索字段
 * @param rule 规则字段
 * @returns {{filterCategory, filterOpenKeys: Array}|{filterCategory: *, filterOpenKeys: Array}}
 */
function getFilterCategory(prevComponentsCategory: CategoryType, value?: string, rule?: string[]) {
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
        if (!rule && componentName.includes(value!) || rule && rule.includes(componentName)) {
          !filterOpenKeys.includes(category) && (filterOpenKeys.push(category));
          update(filterCategory, `${category}.components`, (componentInfos = {}) => {
            componentInfos[componentName] = componentInfo;
            return componentInfos;
          });
        }

      });

    } else if (!rule && category.includes(value!) || rule && rule.includes(category)) {
      filterOpenKeys.push(category);
      filterCategory[category] = infos;
    }
  });
  return { filterOpenKeys, filterCategory };
}
/**
 * 搜索过滤回调
 */
function searchFilter  (inputValue: string, option: any) {
  return option.props.children.toUpperCase().includes(inputValue.toUpperCase())
}
/**
 * 渲染折叠Header
 */
function renderHeader (categoryName: string, isFold: boolean) {
  return (
    <div className={styles['fold-header']}>
      <Icon
        className={isFold ? styles.rotate90 : ''}
        style={{ marginLeft: '5px', marginRight: '5px', transition: 'all 0.2s' }}
        type="caret-right"
      />
      <span style={{ color: '#555555' }}>{categoryName}</span>
    </div>
  );
}
/**
 * 渲染拖拽item
 */
function renderDragItem (span: number = 24, key: string, componentName: string, defaultProps?: any) {
  return (<Col span={span} key={key}>
    <DragAbleItem
      dragSource={{ componentName, defaultProps }}
    />
  </Col>);
}

/**
 * 渲染分类组件中的组件
 * @param categoryInfo  分类信息
 * @param categoryName  分分类名字
 * @param isShow        是否展示分割分类组件名
 */
function renderContent(categoryInfo: ComponentInfoType | null, categoryName: string, isShow?: boolean) {
  let items:any = null, isShowCategoryName = false;
  if (!categoryInfo || isEmpty(categoryInfo.props || categoryInfo.components)) {
    items = renderDragItem(undefined, categoryName, categoryName);
  } else {
    const { span = 24, props, components } = categoryInfo;
    const renderItems = props || components;
    items = map(renderItems, (v: ComponentCategoryType | any, k) => {
      if (!isArray(renderItems)) {
        return renderContent(v, k, true);
      }
      /**
       * 如果有默认属性显示分割分类
       */
      if (v) isShowCategoryName = true;
      return renderDragItem(span as number, k, categoryName, v);
    });
  }

  return (
    <Row key={categoryName} className={styles['fold-content']}>
      {items}
      {isShowCategoryName && isShow &&
      <Divider style={{ fontSize: 12, fontWeight: 'normal', marginTop: 10 }}>{categoryName}</Divider>}
    </Row>
  );
}


interface FoldPanelPropsType {
  componentsCategory: CategoryType,  //组件分类
  isShow?: boolean,

}

function BrickPreview(props: FoldPanelPropsType) {
  const { componentsCategory, isShow=true } = props;
  const searchValues=flattenDeepArray(componentsCategory)
  const { selectedInfo } = useSelector(['selectedInfo']);
  const  { childNodesRule }=selectedInfo||{};
  const [openKeys = [], setOpenKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [category, setCategory] = useState(componentsCategory);

  const prevIsShow = usePrevious(isShow);
  const prevChildNodesRule = usePrevious(childNodesRule);
  const prevCategory = usePrevious(category);
  useEffect(() => {
    if (isShow !== prevIsShow || isShow && !isEqual(prevChildNodesRule, childNodesRule)) {
      const { filterOpenKeys, filterCategory } = getFilterCategory(componentsCategory, searchValue, childNodesRule);
      if (!isEqual(filterCategory, prevCategory)) {
        setOpenKeys(filterOpenKeys);
        setCategory(filterCategory);
      }

    }
  }, [searchValue, prevIsShow, prevChildNodesRule, childNodesRule, prevCategory, isShow]);


  /**
   * 搜搜指定组件
   */
  const onChange = useCallback((value: any) => {
    let filterOpenKeys: any[] = [], filterCategory = componentsCategory;
    if (isEmpty(value)) {
      if (childNodesRule) {
        ({ filterOpenKeys, filterCategory } = getFilterCategory(componentsCategory, undefined, childNodesRule));
      }
      setOpenKeys(filterOpenKeys);
      setCategory(filterCategory);
      setSearchValue(value);

    }
  }, [childNodesRule]);

  /**
   * 搜索下拉框选中组件名称时的回调
   */
  const onSelect = useCallback((value: any) => {
    const { filterOpenKeys, filterCategory } = getFilterCategory(componentsCategory, value, childNodesRule);
    setOpenKeys(filterOpenKeys);
    setSearchValue(value);
    setCategory(filterCategory);
  }, [childNodesRule]);

  return (
    <>
      <AutoComplete
        style={{ marginLeft: 20, marginRight: 20 }}
        dataSource={childNodesRule || searchValues}
        filterOption={searchFilter}
        onSelect={onSelect}
        onChange={onChange}
      >
        <Input.Search allowClear/>
      </AutoComplete>
      <div className={styles['fold-container']}>
        {isEmpty(category) ? <p style={{ textAlign: 'center' }}>为找当前选中组件可拖拽的组件</p> :
          <Collapse
            bordered={false}
            activeKey={openKeys}
            style={{ backgroundColor: '#fff' }}
            onChange={(newOpenKeys: any) => setOpenKeys(newOpenKeys)}>
            {map(category, (categoryInfo: ComponentInfoType, categoryName) => {
              const isFold = openKeys.includes(categoryName);
              return <Panel style={{ border: 0 }}
                            header={renderHeader(categoryName, isFold)}
                            key={categoryName}
                            showArrow={false}>
                {renderContent(categoryInfo, categoryName)}
              </Panel>;
            })}

          </Collapse>}
      </div>
    </>

  );
}

export default memo<FoldPanelPropsType>(BrickPreview, (prevProps, nextProps) => {
  const { isShow} = nextProps;
  /**
   * 当前组件不可见时 不触发组件渲染，相反触发渲染
   */
  return !isShow;
});
