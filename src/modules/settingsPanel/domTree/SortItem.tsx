import React, { memo, useEffect, useState } from 'react';
import { Collapse, Dropdown, Icon, Menu, Tooltip } from 'antd';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import SortTree from './SortTree';
import styles from './index.less';
import { usePrevious } from '@/utils';
import config from '@/configs';
import { ACTION_TYPES } from '@/models';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { Dispatch } from 'redux';
import domTreeIcons from './domTreeIcons';

const { Panel } = Collapse;
const { Item } = Menu;

export interface TreeNodeType extends VirtualDOMType {
  parentKey?: string,
  propName?: string,
  isRequired?: boolean,
  parentName?: string,
  isOnlyNode?: boolean,
  label?: string,
  tip?: string,
}

interface SortItemPropsType {
  dispatch?: Dispatch,
  selectedComponentInfo?: SelectedComponentInfoType,
  componentConfig: TreeNodeType,
  domTreeKeys: string[],
  hoverKey?: string,
  isFold?: boolean,
  path?: string,
  parentPath?: string,
  propPath?: string,
  childNodesRule?: string[]
}

function SortItem(props: SortItemPropsType) {

  let childPropName: string | undefined, isSelected = false;
  const [isUnfold, setIsUnfold] = useState(false);
  const {
    selectedComponentInfo,
    hoverKey,
    childNodesRule,
    componentConfig,
    componentConfig: { key, parentKey, componentName, isRequired, label, tip, childNodes, parentName, propName, isOnlyNode },
    path,
    propPath,
    dispatch,
    domTreeKeys,
    isFold,
    parentPath,
  } = props;
  const selectedKey = get(selectedComponentInfo, 'selectedKey', '');
  const prevPath = usePrevious(path);
  const prevChildNodes = usePrevious(childNodes);
  useEffect(() => {
    if (prevPath !== path && selectedKey === key) {
      dispatchData(ACTION_TYPES.selectComponent);
    }
  }, [prevPath, path, selectedKey, key]);

  useEffect(() => {
    if (!isUndefined(prevChildNodes) && isEmpty(prevChildNodes) && !isEmpty(childNodes)) {
      setIsUnfold(true);
    }
  }, [prevChildNodes, childNodes]);

  const selectedDomTreeKeys: string[] = get(selectedComponentInfo, 'domTreeKeys', []);

  if (!isEmpty(selectedDomTreeKeys) && !isUnfold && selectedDomTreeKeys.includes(key)) {
    setIsUnfold(true);
  }

  if (isFold && isUnfold) setIsUnfold(false);


  function dispatchData(actionType: string) {
    let { propPath } = props;
    if (childPropName) {
      propPath = `${path}.${childPropName}`;
    }
    dispatch!({
      type: actionType,
      payload: {
        propName: propName || childPropName,
        propPath,
        path,
        parentPath,
        componentConfig,
        domTreeKeys,
        isRequiredHasChild: isRequired && isEmpty(childNodes),
      },
    });
  };

  const deleteComponent = () => dispatchData(ACTION_TYPES.deleteComponent);
  const copyComponent = () => dispatchData(ACTION_TYPES.copyComponent);
  const clearChildNodes = () => dispatchData(ACTION_TYPES.clearChildNodes);

  function handleMenuClick(e: any) {
    switch (e.key) {
      case '1':
        return clearChildNodes();
      case '2':
      case '3':
        return copyComponent();
      case '4':
        return deleteComponent();
    }
  };

  function renderMenu() {
    return (
      <Menu onClick={handleMenuClick}>
        {!childPropName && !isEmpty(childNodes) && <Item key={1}>清除</Item>}
        {!parentKey && <Item key={3}>复制</Item>}
        {!parentKey && <Item key={4}>删除</Item>}
      </Menu>);
  };

  /**
   * 选中组件与取消选中
   */
  function selectComponent() {
    if (isSelected) {
      dispatchData(ACTION_TYPES.clearSelectedStatus);
    } else {
      dispatchData(ACTION_TYPES.selectComponent);
    }
  };


  function onMouseOver(e: any) {
    e.stopPropagation();
    const { dispatch, selectedComponentInfo, componentConfig: { key } } = props;
    isEmpty(selectedComponentInfo) && dispatch!({
      type: ACTION_TYPES.overTarget,
      payload: {
        hoverKey: key,
      },
    });
  };

  function getIcon(name: string) {
    if (get(domTreeIcons, `${name}`)) return get(domTreeIcons, `${name}`);
    return domTreeIcons.Layout;
  };


  /**
   * 渲染页面结构节点
   * @returns {*}
   */
  function renderHeader() {
    const selectedColor = '#5E96FF';
    const unSelectedColor = '#555555';
    const selectedBGColor = '#F2F2F2';
    const hoveredBGColor = '#F1F1F1';
    const color = isSelected ? selectedColor : unSelectedColor;
    const isHovered = key === hoverKey && isEmpty(selectedComponentInfo);

    return (
      <div
        style={{ backgroundColor: isSelected ? selectedBGColor : isHovered ? hoveredBGColor : '#0000' }}
        className={styles['header-container']}
      >
        <div onClick={selectComponent}
             onMouseOver={onMouseOver}
             style={{ display: 'flex', flex: 1, alignItems: 'center', color }}>
          <Icon
            className={isUnfold ? styles.rotate90 : ''}
            style={{
              padding: 5,
              fontSize: 16,
              transition: 'all 0.2s',
              color: !isEmpty(childNodes) ? unSelectedColor : '#0000',
            }}
            type="caret-right"
            onClick={(event) => {
              event.stopPropagation();
              setIsUnfold(!isUnfold);
            }
            }
          />
          <Icon component={getIcon(componentName)} style={{ marginRight: 7 }}/>
          {tip ? <Tooltip title={tip}>
            <span>{label || componentName}</span>
          </Tooltip> : <span>{label || componentName}</span>}
        </div>
        {
          isSelected &&
          <Dropdown
            trigger={['click']}
            overlay={renderMenu()}
          >
            <Icon component={getIcon('more')} style={{ color }}/>
          </Dropdown>
        }
      </div>
    );
  };

  /**
   * 渲染子组件或者属性节点
   * @returns {Array|*}
   */
  function renderSortTree(isOnlyNode?: boolean) {
    const currentName = parentName ? `${parentName}.${propName}` : componentName;
    const newPath = propPath || path;
    if (isArray(childNodes)) {
      return (<SortTree
        isFold={!isUnfold}
        path={newPath}
        isOnlyNode={isOnlyNode}
        childNodesRule={childNodesRule}
        dispatch={dispatch}
        currentName={currentName}
        childNodes={childNodes}
        domTreeKeys={domTreeKeys}
        selectedComponentInfo={selectedComponentInfo}
        hoverKey={hoverKey}
      />);
    }
    childPropName = undefined;
    const { nodePropsConfig } = get(config.AllComponentConfigs, componentName);
    /**
     * 处理属性节点子组件
     */
    return map(childNodes, (propChildNode, propName) => {
      childPropName = propName;
      const { childNodesRule, label, tip, isRequired } = nodePropsConfig![propName];
      const propKey = `${key}${propName}`;
      const newComponentConfig = {
        ...componentConfig,
        ...propChildNode,
        key: propKey,
        parentName: componentConfig.componentName,
        componentName: propName,
        propName,
        label,
        tip,
        isRequired,
      };
      const propPath = `${path}.childNodes.${propName}`;
      return <SortItem
        selectedComponentInfo={selectedComponentInfo}
        hoverKey={hoverKey}
        dispatch={dispatch}
        isFold={isFold}
        componentConfig={newComponentConfig}
        path={path}
        parentPath={parentPath}
        propPath={propPath}
        key={propName}
        domTreeKeys={[...domTreeKeys, propKey]}
        childNodesRule={childNodesRule}
      />;
    });

  }


  const newPath = propPath || path;
  isSelected = selectedKey && !parentName ? selectedKey.includes(key) : selectedKey === key;
  let sortTree = null;
  const { parentNodesRule } = get(config.AllComponentConfigs, parentName || componentName);
  const currentName = parentName ? `${parentName}.${propName}` : componentName;
  if (!!childNodes) {
    sortTree = isEmpty(childNodes) ?
      <div style={{ marginLeft: 24 }}>
        <SortTree
          path={newPath}
          dispatch={dispatch}
          domTreeKeys={domTreeKeys}
          childNodesRule={childNodesRule}
          currentName={currentName}
        />
      </div> :
      <Collapse
        activeKey={isUnfold ? ['1'] : []}
        style={{ marginLeft: 24 }}
        bordered={false}
      >
        <Panel showArrow={false} key={'1'} header={<div/>} style={{ border: 0, backgroundColor: '#fff' }}>
          {renderSortTree(isOnlyNode)}
        </Panel>
      </Collapse>;
  }

  return (
    <div
      className={styles['sort-item']}
      data-info={JSON.stringify(componentConfig)}
      data-name={parentName || componentName}
      data-parents={parentNodesRule && JSON.stringify(parentNodesRule)}
      id={key}
    >
      {renderHeader()}

      {sortTree}
    </div>
  );
}


export default memo<SortItemPropsType>(SortItem);
