import React, { Component } from 'react';
import { AutoComplete, Col, Collapse, Input, Row } from 'antd';
import { Icon } from '@/components';
import map from 'lodash/map';
import update from 'lodash/update';
import each from 'lodash/each';
import styles from '../index.less';
import DragAbleItem from './DragAbleItem';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { CategoryType, ComponentInfoType, ComponentPropsType } from '@/types/CategoryType';
import { SelectedComponentInfoType } from '@/types/ModelType';

const { Panel } = Collapse;

/**
 * 获取过滤后的组件配置信息
 * @param prevComponentsCategory
 * @param value 搜索字段
 * @param rule 规则字段
 * @returns {{componentsCategory, openKeys: Array}|{componentsCategory: *, openKeys: Array}}
 */
function getFilterCategory(prevComponentsCategory:CategoryType, value:any, rule?:string[] ) {
  const openKeys:string[] = [];
  const componentsCategory:CategoryType = {};
  value=isEmpty(value)?null:value

  if(value&&rule){
    rule=rule.filter((name)=>name.includes(value))
  }else if(!value&&!rule){
    return {componentsCategory:prevComponentsCategory,openKeys}
  }
  each(prevComponentsCategory, (infos, category) => {
    const { components } = infos;
    if (components) {
      each(components,(componentInfo,componentName)=>{
        if (!rule&&componentName.includes(value)||rule&&rule.includes(componentName)) {
          !openKeys.includes(category) && (openKeys.push(category));
          update(componentsCategory, `${category}.components`, (componentInfos = {}) => {
            componentInfos[componentName] = componentInfo;
            return componentInfos;
          });
        }

      })

    } else if (!rule&&category.includes(value)||rule&&rule.includes(category)) {
      openKeys.push(category);
      componentsCategory[category] = infos;
    }
  });
  return { openKeys, componentsCategory };
}

interface FoldPanelPropsType {
  componentsCategory:CategoryType,
  selectedComponentInfo:SelectedComponentInfoType,
  autoCompleteData:string[],
  isShow:boolean
}

interface FoldPanelStateType {
  componentsCategory:CategoryType,
  openKeys:string[],
  searchValue:string
}
export default class FoldPanel extends Component<FoldPanelPropsType,FoldPanelStateType> {
  constructor(props:FoldPanelPropsType) {
    super(props);
    const { componentsCategory } = props;
    this.state = {
      openKeys: [],
      componentsCategory,
      searchValue:'',
    };
  }


  shouldComponentUpdate(nextProps:FoldPanelPropsType, nextState:FoldPanelStateType) {
    const { isShow,selectedComponentInfo:{childNodesRule} } = nextProps;
    const {selectedComponentInfo:{childNodesRule:prevChildNodesRule},isShow:prevIsShow}=this.props
    const { componentsCategory, openKeys } = nextState;
    const { componentsCategory: prevComponentsCategory, openKeys: prevOpenKeys} = this.state;
    if(isShow&&prevIsShow)
      return !isEqual(componentsCategory, prevComponentsCategory) || !isEqual(openKeys, prevOpenKeys)||!isEqual(childNodesRule,prevChildNodesRule);
    return isShow
  }

  componentDidUpdate(prevProps:FoldPanelPropsType, prevState:FoldPanelStateType) {
    const { isShow:prevIsShow,selectedComponentInfo:{childNodesRule:prevChildNodesRule} } = prevProps;
    const {selectedComponentInfo: {childNodesRule },componentsCategory,isShow}=this.props
    const {componentsCategory:prevComponentsCategory}=prevState
    const {searchValue}=this.state
    if (isShow !== prevIsShow||isShow&&!isEqual(prevChildNodesRule,childNodesRule)) {
        const { openKeys=[], componentsCategory: nextComponentsCategory } = getFilterCategory(componentsCategory, searchValue, childNodesRule);
      if (!isEqual(nextComponentsCategory, prevComponentsCategory)) return this.setState({
        openKeys,
        componentsCategory: nextComponentsCategory,
      })
    }
  }

  collapseChange = (openKeys:any) => {
    this.setState({
      openKeys,
    });
  };

  renderHeader(categoryName:string) {
    const { openKeys } = this.state;
    return (
      <div className={styles['fold-header']}>
        <Icon
          className={openKeys.includes(categoryName) ? styles.rotate90 : ''}
          style={{ marginLeft: '5px', marginRight: '5px', transition: 'all 0.2s' }}
          type="caret-right"
        />
        <span style={{ color: '#555555' }}>{categoryName}</span>
      </div>
    );
  }

  renderDragItem = (span:number, key:string, componentName:string, defaultProps?:any, describeInfo?:any) => {
    return (<Col span={span} key={key}>
      <DragAbleItem
        item={{ componentName, defaultProps }}
      />
      <div style={{ textAlign: 'center' }}>{describeInfo || componentName}</div>
    </Col>);
  };

  renderContent = (categoryInfo:ComponentInfoType, categoryName:string) => {
    const { span = 24, props, components } = categoryInfo;
    const renderItems = props || components;
    const isArr = isArray(renderItems);
    let items = null;
    if (isArr&&isEmpty(renderItems)) {
      items = this.renderDragItem(span as number, categoryName, categoryName);
    } else {
      items = map(renderItems, (v:ComponentPropsType, k) => {
        let componentName = isArr ? categoryName : k;
        let describeInfo = isArr ? (v.describeInfo || categoryName) : k;
        return this.renderDragItem(span as number, k, componentName, v, describeInfo);
      });
    }
    return (
      <Row className={styles['fold-content']}>
        {items}
      </Row>
    );
  };

  searchFilter = (inputValue:string, option:any) => option.props.children.toUpperCase().includes(inputValue.toUpperCase());

  onChange = (value:any) => {
    let { componentsCategory, selectedComponentInfo: { childNodesRule } } = this.props;
    let openKeys:string[] = [];
    if (isEmpty(value)) {
      if (childNodesRule) {
        ({ openKeys, componentsCategory } = getFilterCategory(this.props.componentsCategory, undefined, childNodesRule));
      }
      this.setState({
        componentsCategory,
        openKeys,
        searchValue:value
      });
    }
  };

  onSelect = (value:any) => {
    const {selectedComponentInfo: { childNodesRule }}=this.props
    const { openKeys, componentsCategory } = getFilterCategory(this.props.componentsCategory, value,childNodesRule);
    this.setState({
      componentsCategory,
      openKeys,
      searchValue:value
    });
  };


  render() {
    const { openKeys, componentsCategory } = this.state;
    const { selectedComponentInfo: { childNodesRule }, autoCompleteData } = this.props;
    return (
      <>
        <AutoComplete
          style={{ marginLeft: 20, marginRight: 20 }}
          dataSource={childNodesRule || autoCompleteData}
          filterOption={this.searchFilter}
          onSelect={this.onSelect}
          onChange={this.onChange}
        >
          <Input.Search allowClear/>
        </AutoComplete>
        <div className={styles['fold-container']}>
          {isEmpty(componentsCategory) ? <p>为找当前选中组件可拖拽的组件</p> :
            <Collapse
              bordered={false}
              activeKey={openKeys}
              style={{ backgroundColor: '#fff' }}
              onChange={this.collapseChange}>
              {map(componentsCategory, (categoryInfo:ComponentInfoType, categoryName) => {
                  return <Panel style={{ border: 0 }}
                                header={this.renderHeader(categoryName)}
                                key={categoryName}
                                showArrow={false}>
                    {this.renderContent(categoryInfo, categoryName)}
                  </Panel>;
                })}

            </Collapse>}
        </div>
      </>

    );
  }
}
