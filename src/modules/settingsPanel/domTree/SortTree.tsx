import React, { useCallback } from 'react';
import map from 'lodash/map';
import { Sortable } from '@/components';
import styles from './index.less';
import SortItem, { TreeNodeType } from './SortItem';
import { getPath } from '@/utils';

import { ACTION_TYPES } from '@/models';
import { Dispatch } from 'redux';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';

interface SortTreePropsType {
  dispatch?: Dispatch,
  path?: string,
  domTreeKeys?: string[],
  isFold?: boolean,
  childNodesRule?: string[],
  childNodes?: VirtualDOMType[],
  isOnlyNode?: boolean,
  currentName?: string,
  disabled?: boolean,
  selectedComponentInfo?: SelectedComponentInfoType,
  hoverKey?: string
}



/**
 * 拖拽排序
 * @param sortKeys
 */
function onLayoutSortChange (sortKeys: string[],  evt: any,props:SortTreePropsType)  {
  const { dispatch, path, domTreeKeys } = props;
  /**
   * 获取拖住节点的信息
   * @type {any}
   */
  const dragNode = JSON.parse(evt.clone.dataset.info);
  dispatch!({
    type: ACTION_TYPES.onLayoutSortChange,
    payload: {
      sortKeys,
      path: getPath({ path, isContainer: true }),
      dragNode,
      domTreeKeys,
    },
  });
};

/**
 * 渲染排序节点
 * @param componentConfig
 * @param index
 * @returns {*}
 */
function renderSortItems(componentConfig: TreeNodeType, index: number,props:SortTreePropsType) {
  const { path, isFold, domTreeKeys = [],dispatch,hoverKey,selectedComponentInfo } = props;
  const { key } = componentConfig;
  return (<SortItem domTreeKeys={[...domTreeKeys, key]}
                    isFold={isFold}
                    componentConfig={componentConfig}
                    path={getPath({ path, index })}
                    parentPath={getPath({ path, isContainer: true })}
                    key={key}
                    dispatch={dispatch}
                    selectedComponentInfo={selectedComponentInfo}
                    hoverKey={hoverKey}
  />);
}


const putItem = ( c: any,props:SortTreePropsType) => {
  const { childNodesRule, childNodes=[], isOnlyNode, currentName } = props;
  const dragName = c.dataset.name;
  const parentNodesRule = c.dataset.parents && JSON.parse(c.dataset.parents);
  if (isOnlyNode && childNodes.length === 1) return false;
  if (parentNodesRule) {
    return parentNodesRule.includes(currentName);
  }
  if (childNodesRule) {
    return childNodesRule.includes(dragName);
  }
  return true;
};


function SortTree(props: SortTreePropsType) {
  const {
   childNodes = [],
    disabled,
  } = props;

  return (
    <Sortable
      options={{
        group: { name: 'nested', put: (a: any, b: any, c: any)=>putItem(c,props) },
        animation: 200,
        disabled,
        dataIdAttr: 'id',
        ghostClass: styles['item-background'],
        swapThreshold: 0.5,
      }}
      onChange={(sortKeys: string[], a: any, evt: any)=>onLayoutSortChange(sortKeys, evt,props)}

    >
      {map(childNodes, (node,index)=>renderSortItems(node,index,props))}
    </Sortable>

  );
}

export default SortTree;
