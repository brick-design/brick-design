import React, { Component } from 'react';
import { Collapse, Dropdown, Icon, Menu, Tooltip } from 'antd';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import SortTree from './SortTree';
import styles from './index.less';
import { getPath, reduxConnect } from '@/utils';
import { AllComponentConfigs, domTreeIcons } from '@/configs';
import {ACTION_TYPES} from '@/models'
import { PropsNodeType, SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import {Dispatch} from 'redux'

const { Panel } = Collapse;
const { Item } = Menu;

 export interface TreeNodeType extends VirtualDOMType{
  parentKey?:string,
  propName?:string,
  isRequired?:boolean,
  parentName?:string,
 isOnlyNode?:boolean,
   label?:string,
   tip?:string,
}
interface SortItemPropsType {
  dispatch?:Dispatch,
  selectedComponentInfo?:SelectedComponentInfoType,
  componentConfig:TreeNodeType,
  domTreeKeys:string[],
  newAddKey?:string,
  hoverKey?:string,
  isFold?:boolean,
  path?:string,
  propPath?:string,
  index:string|number,
  childNodesRule:string[]
}

interface SortItemStateType {
  isUnfold:boolean
}

@reduxConnect(['selectedComponentInfo', 'newAddKey', 'hoverKey'])
class SortItem extends Component<SortItemPropsType,SortItemStateType> {

  propName?:string
  isSelected:boolean


  constructor(props:SortItemPropsType) {
    super(props);
    const { componentConfig: { key }, newAddKey ,domTreeKeys} = props;
    const isUnfold = !!newAddKey && domTreeKeys.includes(key);
    this.state = {
      isUnfold,
    };
    this.isSelected=false;

  }

  static getDerivedStateFromProps(nextProps:SortItemPropsType, preState:SortItemStateType) {
    const { componentConfig: { key }, isFold, selectedComponentInfo } = nextProps;
    const domTreeKeys:string[]=get(selectedComponentInfo,'domTreeKeys',[])
    const { isUnfold } = preState;
    if (!isEmpty(domTreeKeys)) {
      if (!isUnfold && domTreeKeys.includes(key)) {
        return { isUnfold: true };
      }
    }
    if (isFold) return { isUnfold: false };
    return null;
  }

  componentDidMount() {
    const { componentConfig: { key }, newAddKey } = this.props;
    if (key === newAddKey) {      // 新添加组件默认选中
      this.dispatchData(ACTION_TYPES.selectComponent);
    }
  }

  componentDidUpdate(prevProps:SortItemPropsType, prevState:SortItemStateType) {
    const { selectedComponentInfo: prevSelectedComponentInfo , path: prevPath ,componentConfig:{childNodes:prevChildNodes}} = prevProps;
    const prevSelectedKey=get(prevSelectedComponentInfo,'selectedKey')
    const { selectedComponentInfo, path, componentConfig: { key,childNodes } } = this.props;
    const selectedKey=get(selectedComponentInfo,'selectedKey')
    if(childNodes&&prevChildNodes!.length===0&&childNodes.length>0) return this.setState({
      isUnfold:true
    })
     if (selectedKey && selectedKey === prevSelectedKey && path !== prevPath && selectedKey === key) {
      this.dispatchData(ACTION_TYPES.selectComponent);
    }


  }

  renderMenu = () => {
    const { componentConfig: { parentKey, childNodes } } = this.props;
    return (
      <Menu onClick={this.handleMenuClick}>
        {!this.propName && !isEmpty(childNodes) && <Item key={1}>清除</Item>}
        {!parentKey && <Item key={3}>复制</Item>}
        {!parentKey && <Item key={4}>删除</Item>}
      </Menu>);
  };

  handleMenuClick = (e:any) => {
    switch (e.key) {
      case '1':
        return this.clearChildNodes();
      case '2':
      case '3':
        return this.copyComponent();
      case '4':
        return this.deleteComponent();
    }
  };

  dispatchData = (actionType:string) => {
    const { componentConfig, componentConfig: { propName,isRequired,childNodes }, domTreeKeys, path, dispatch, index } = this.props;
    let { propPath } = this.props;
    let newPath = getPath({ path, index });
    if (this.propName) {
      propPath = `${getPath({ path: newPath, isContainer: true })}.${this.propName}`;
    }
    dispatch!({
      type: actionType,
      payload: {
        propName: propName || this.propName,
        propPath,
        path: newPath,
        parentPath: getPath({ path, isContainer: true }),
        componentConfig,
        domTreeKeys,
        isRequiredHasChild:isRequired&&isEmpty(childNodes)
      }
    });
  };

  /**
   * 选中组件与取消选中
   */
  selectComponent = () => {
    if (this.isSelected) {
      this.dispatchData(ACTION_TYPES.clearSelectedStatus);
    } else {
      this.dispatchData(ACTION_TYPES.selectComponent);
    }
  };

  /**
   * 删除组件
   */
  deleteComponent = () => this.dispatchData(ACTION_TYPES.deleteComponent);

  /**
   * 复制组件
   */
  copyComponent = () => this.dispatchData(ACTION_TYPES.copyComponent);

  clearChildNodes = () => this.dispatchData(ACTION_TYPES.clearChildNodes);

  onMouseOver = (e:any) => {
    e.stopPropagation();
    const { dispatch, selectedComponentInfo, componentConfig: { key } } = this.props;
    isEmpty(selectedComponentInfo) &&dispatch&& dispatch({
      type: ACTION_TYPES.overTarget,
      payload:{
        hoverKey: key
      }
    });
  };
  getIcon = (name:string) => {
    if (get(domTreeIcons,`${name}`)) return get(domTreeIcons,`${name}`);
    return domTreeIcons.Layout;
  };


  /**
   * 渲染页面结构节点
   * @returns {*}
   */
  renderHeader = () => {
    const { isUnfold } = this.state;
    const { componentConfig: { componentName, label,tip, childNodes, key }, hoverKey, selectedComponentInfo } = this.props;
    const selectedColor = '#5E96FF';
    const unSelectedColor = '#555555';
    const selectedBGColor = '#F2F2F2';
    const hoveredBGColor = '#F1F1F1';
    const color = this.isSelected ? selectedColor : unSelectedColor;
    const isHovered = key === hoverKey && isEmpty(selectedComponentInfo);

    return (
      <div
        style={{ backgroundColor: this.isSelected ? selectedBGColor : isHovered ? hoveredBGColor : '#0000' }}
        className={styles['header-container']}
      >
        <div onClick={this.selectComponent}
             onMouseOver={this.onMouseOver}
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
            onClick={this.onFoldChange}
          />
          <Icon component={this.getIcon(componentName)} style={{ marginRight: 7 }}/>
          {tip?<Tooltip title={tip}>
          <span>{label || componentName}</span>
          </Tooltip>: <span>{label || componentName}</span>}
        </div>
        {
          this.isSelected &&
          <Dropdown
            trigger={['click']}
            overlay={this.renderMenu()}
          >
            <Icon component={this.getIcon('more')} style={{ color }}/>
          </Dropdown>
        }
      </div>
    );
  };

  /**
   * 渲染子组件或者属性节点
   * @param childNodes
   * @returns {Array|*}
   */
  renderSortTree = (childNodes:TreeNodeType[]|PropsNodeType, isOnlyNode?:boolean) => {
    const {
      path,
      index,
      propPath,
      dispatch,
      isFold,
      selectedComponentInfo,
      componentConfig,
      componentConfig: { key, componentName, parentName, propName },
      domTreeKeys = [],
      newAddKey,
      hoverKey,
      childNodesRule,
    } = this.props;
    const { isUnfold } = this.state;
    const currentName = parentName ? `${parentName}.${propName}` : componentName;
    const newPath = propPath || getPath({ path, index });
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
      />);
    }
    this.propName = undefined;
    const { nodePropsConfig } = get(AllComponentConfigs, componentName, {});
    /**
     * 处理属性节点子组件
     */
    return map(childNodes, (propChildNode, propName) => {
      this.propName = propName;
      const { childNodesRule,label,tip,isRequired } = nodePropsConfig[propName];
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
        isRequired
      };
      const propPath = `${getPath({ path, index })}.childNodes.${propName}`;
      return <SortItem
        isFold={isFold}
        componentConfig={newComponentConfig}
        selectedComponentInfo={selectedComponentInfo}
        path={path}
        index={index}
        propPath={propPath}
        key={propName}
        newAddKey={newAddKey}
        hoverKey={hoverKey}
        domTreeKeys={[...domTreeKeys, propKey]}
        dispatch={dispatch}
        childNodesRule={childNodesRule}
      />;
    });

  };


  onFoldChange = (event:any) => {
    event && event.stopPropagation();
    this.setState({ isUnfold: !this.state.isUnfold });
  };


  render() {
    const {
      childNodesRule,
      componentConfig,
      componentConfig: { childNodes, key, componentName, parentName, propName, isOnlyNode },
      path,
      propPath,
      index,
      selectedComponentInfo,
      dispatch,
      domTreeKeys,
    } = this.props;
    const newPath = propPath || getPath({ path, index });
    const selectedKey=get(selectedComponentInfo,'selectedKey')
    const { isUnfold } = this.state;
    this.isSelected = selectedKey && !parentName ? selectedKey.includes(key) : selectedKey === key;
    let sortTree = null;
    const { parentNodesRule } = get(AllComponentConfigs, parentName || componentName, {});
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
            {this.renderSortTree(childNodes, isOnlyNode)}
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
        {this.renderHeader()}

        {sortTree}
      </div>
    );
  }

}

export default SortItem
