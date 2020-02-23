import React, { PureComponent } from 'react';
import map from 'lodash/map';
import { Sortable } from '@/components';
import styles from './index.less';
import SortItem, { TreeNodeType } from './SortItem';
import { getPath } from '@/utils';
import get from 'lodash/get';
import { AllComponentConfigs } from '@/configs';
import {ACTION_TYPES} from '@/models'
import {Dispatch} from 'redux'
import { VirtualDOMType } from '@/types/ModelType';
interface SortTreePropsType {
  dispatch?:Dispatch,
  path?:string,
  domTreeKeys?:string[],
  isFold?:boolean,
  childNodesRule?:string[],
  childNodes?:VirtualDOMType[],
  isOnlyNode?:boolean,
  currentName?:string,
  disabled?:boolean
}
export default class SortTree extends PureComponent<SortTreePropsType> {

  /**
   * 拖拽排序
   * @param sortKeys
   */
  onLayoutSortChange = (sortKeys:string[], a:any, evt:any) => {
    /**
     * 获取拖住节点的信息
     * @type {any}
     */
    const dragNode = JSON.parse(evt.clone.dataset.info);
    const { dispatch, path, domTreeKeys } = this.props;
    dispatch&&dispatch({
      type: ACTION_TYPES.onLayoutSortChange,
      payload:{
        sortKeys,
        path: getPath({ path, isContainer: true }),
        dragNode,
        domTreeKeys,
      }
    });
  };

  /**
   * 渲染排序节点
   * @param componentConfig
   * @param index
   * @returns {*}
   */
  renderSortItems = (componentConfig:TreeNodeType, index:number) => {
    const { path, isFold, domTreeKeys = [] } = this.props;
    const { key, componentName } = componentConfig;
    const { childNodesRule } = get(AllComponentConfigs, componentName, {});

    return (<SortItem domTreeKeys={[...domTreeKeys, key]}
                      isFold={isFold}
                      componentConfig={componentConfig}
                      path={getPath({path,index})}
                      parentPath={getPath({path,isContainer:true})}
                      childNodesRule={childNodesRule}
                      key={key}/>);
  };


  putItem = (a:any, b:any, c:any) => {
    const { childNodesRule, childNodes=[], isOnlyNode, currentName } = this.props;
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

  render() {
    const { childNodes, disabled } = this.props;
    return (
      <Sortable
        options={{
          group: { name: 'nested', put: this.putItem },
          animation: 200,
          disabled,
          dataIdAttr: 'id',
          ghostClass: styles['item-background'],
          swapThreshold: 0.5,
        }}
        onChange={this.onLayoutSortChange}

      >
        {map(childNodes, this.renderSortItems)}
      </Sortable>

    );
  }
}
