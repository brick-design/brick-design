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

function SortTree(props: SortTreePropsType) {
  const {
    dispatch, path, domTreeKeys = [], isFold,
    childNodesRule, childNodes = [], isOnlyNode, currentName,
    disabled,
    selectedComponentInfo,
    hoverKey,
  } = props;

  /**
   * 拖拽排序
   * @param sortKeys
   */
  const onLayoutSortChange=useCallback((sortKeys: string[], a: any, evt: any)=> {
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
  },[domTreeKeys,path])

  /**
   * 渲染排序节点
   * @param componentConfig
   * @param index
   * @returns {*}
   */
  function renderSortItems(componentConfig: TreeNodeType, index: number) {
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


  const putItem=useCallback((a: any, b: any, c: any)=> {
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
  },[isOnlyNode,childNodes,childNodesRule])
  return (
    <Sortable
      options={{
        group: { name: 'nested', put: putItem },
        animation: 200,
        disabled,
        dataIdAttr: 'id',
        ghostClass: styles['item-background'],
        swapThreshold: 0.5,
      }}
      onChange={onLayoutSortChange}

    >
      {map(childNodes, renderSortItems)}
    </Sortable>

  );
}

export default SortTree;
