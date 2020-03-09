import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Collapse, Dropdown, Icon, Menu, Tooltip } from 'antd';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import isEqual from 'lodash/isEqual'
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
let dispatch:Dispatch
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


function dispatchData (actionType: string,props:SortItemPropsType,childPropName?:string,isRequiredHasChild?:boolean) {
  const { componentConfig,parentPath, componentConfig: { propName }, domTreeKeys, path } = props;
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
      isRequiredHasChild,
    },
  });
};

const deleteComponent = (props:SortItemPropsType) => dispatchData(ACTION_TYPES.deleteComponent,props);
const copyComponent = (props:SortItemPropsType) => dispatchData(ACTION_TYPES.copyComponent,props);
const clearChildNodes = (props:SortItemPropsType) => dispatchData(ACTION_TYPES.clearChildNodes,props);

const handleMenuClick = (e: any,props:SortItemPropsType) => {
  switch (e.key) {
    case '1':
      return clearChildNodes(props);
    case '2':
    case '3':
      return copyComponent(props);
    case '4':
      return deleteComponent(props);
  }
};

function renderMenu (props:SortItemPropsType,childPropName?:string) {
  const { componentConfig: { parentKey, childNodes } } = props;
  return (
    <Menu onClick={(e)=>handleMenuClick(e,props)}>
      {!childPropName && !isEmpty(childNodes) && <Item key={1}>清除</Item>}
      {!parentKey && <Item key={3}>复制</Item>}
      {!parentKey && <Item key={4}>删除</Item>}
    </Menu>);
};

function onMouseOver(e: any,noHasSelectedInfo:boolean,key:string) {
  e.stopPropagation();
  noHasSelectedInfo && dispatch!({
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
 * 选中组件与取消选中
 */
function selectComponent(props:SortItemPropsType,isSelected?:boolean,childPropName?:string,isRequiredHasChild?:boolean){
  let action:string
  if (isSelected) {
    action=ACTION_TYPES.clearSelectedStatus
  } else {
    action=ACTION_TYPES.selectComponent
  }

  dispatchData(action,props,childPropName,isRequiredHasChild);

};



/**
 * 渲染页面结构节点
 * @returns {*}
 */
function renderHeader(isUnfold:boolean,props:any,isSelected:boolean,setIsUnfold:any,childPropName:any) {
  const { componentConfig: { componentName, label,tip, childNodes, key }, hoverKey, selectedComponentInfo } = props;

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
      <div onClick={()=>selectComponent(props,isSelected,childPropName.current)}
           onMouseOver={(e)=>onMouseOver(e,isEmpty(selectedComponentInfo),key)}
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
          overlay={renderMenu(props,childPropName.current)}
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
function renderSortTree(props:any,childNodes:any,isUnfold:boolean,childPropName:any,isOnlyNode?: boolean) {
  const {
    path,
    propPath,
    isFold,
    componentConfig,
    componentConfig: { key, componentName, parentName, propName },
    domTreeKeys = [],
    childNodesRule,
    parentPath,
    selectedComponentInfo,
    hoverKey
  } = props;

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

  const { nodePropsConfig } = get(config.AllComponentConfigs, componentName);
  /**
   * 处理属性节点子组件
   */
  return map(childNodes, (propChildNode, propName) => {
    childPropName.current = propName;
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



function SortItem(props: SortItemPropsType) {

  let childPropName = useRef<string | undefined>(), isSelected = false;
  const [isUnfold, setIsUnfold] = useState(false);
  const {
    selectedComponentInfo,
    childNodesRule,
    componentConfig,
    componentConfig: { key,  componentName, isRequired,childNodes, parentName, propName, isOnlyNode },
    path,
    propPath,
    domTreeKeys,
    isFold,
  } = props;
  dispatch=props.dispatch!
  const selectedKey = get(selectedComponentInfo, 'selectedKey', '');
  const selectedDomTreeKeys: string[] = get(selectedComponentInfo, 'domTreeKeys', []);
  const prevPath = usePrevious(path);
  const prevChildNodes = usePrevious(childNodes);
  const isRequiredHasChild = useMemo(() => isRequired && isEmpty(childNodes), [childNodes]);

  useEffect(() => {
    if (!isUndefined(prevChildNodes)&&isEmpty(prevChildNodes) && !isEmpty(childNodes)) {
      setIsUnfold(true);
    }
  }, [prevChildNodes, childNodes]);
  useEffect(() => {
    const {path,componentConfig:{key}}=props
    if (prevPath !== path && selectedKey === key) {
      dispatchData(ACTION_TYPES.selectComponent,props,childPropName.current,isRequiredHasChild);
    }
  }, [prevPath, props, selectedKey,isRequiredHasChild]);

  useEffect(()=>{
    if (isFold && isUnfold) setIsUnfold(false);
  },[isFold,isUnfold])

  if (!isEmpty(selectedDomTreeKeys) && !isUnfold && selectedDomTreeKeys.includes(key)) {
    setIsUnfold(true);
  }



  /**
   * 当拖拽item未夸层级改变顺序时item的path路径就会改变如果此时是选中状态就会
   * 再次触发选中action 更新selectComponentInfo
   */

  /**
   * 如果是当前节点为属性节点就使用属性节点path
   */
  const newPath = propPath || path;
  /**
   * 当前节点是否被选中
   */
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
          {renderSortTree(props,childNodes,isUnfold,childPropName,isOnlyNode)}
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
      {renderHeader(isUnfold,props,isSelected,setIsUnfold,childPropName)}

      {sortTree}
    </div>
  );
}


export default memo<SortItemPropsType>(SortItem);
