import React, { Component } from 'react';
import { Tabs } from 'antd';
import { confirmModal } from '../../config';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { ObjectComponent, SortComponent } from '../index';
import styles from '../../index.less';
import {ACTION_TYPES} from '@/models';
import { formatPropsFieldConfigPath, reduxConnect } from '@/utils';
import { PropsConfigType } from '@/types/ComponentConfigType';
import {Dispatch} from 'redux'
import { PROPS_TYPES } from '@/types/ConfigTypes';
interface ObjectArrayPropsType {
  value?:any,
  childPropsConfig:PropsConfigType[],
  dispatch?:Dispatch,
  type:PROPS_TYPES,
  parentFieldPath:string,
  field:string,
  onChange:(value:any)=>void
}

 export interface PaneType{
  childPropsConfig:PropsConfigType,
  key:string,
  value:any
}

interface ObjectArrayStateType {
  activeKey: string,
  isSort: boolean,
  panes:PaneType[],
  tabIndex:number
}
const { TabPane } = Tabs;
@reduxConnect()
class ObjectArrayComponent extends Component<ObjectArrayPropsType,ObjectArrayStateType> {

  nextTabIndex:number
  changeOASetTimeout:any
  childPropsConfig:PropsConfigType[]
  constructor(props:ObjectArrayPropsType) {
    super(props);
    const { value, childPropsConfig } = props;
    this.nextTabIndex = 0;
    this.state = {
      activeKey: 'object0',
      isSort: false,
      panes: map(value, (v, index) => ({
        value: v,
        childPropsConfig: get(childPropsConfig,`[${index}]`,{}),
        key: `object${this.nextTabIndex++}`,
      })),
      tabIndex: this.nextTabIndex,
    };
    this.changeOASetTimeout = null;
    this.childPropsConfig=childPropsConfig
  }

  static getDerivedStateFromProps(nextProps:ObjectArrayPropsType, prevState:ObjectArrayStateType) {
    const { isSort } = prevState;
    if (isSort) return { isSort: false };
    return null
  }

  onChange = (activeKey:string) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey:any, action:'add'|'remove') => {
    this[action](targetKey);
  };

  componentDidUpdate() {
    const {childPropsConfig}=this.props
    const { tabIndex,panes } = this.state;
    tabIndex > this.nextTabIndex && (this.nextTabIndex = tabIndex);
    if(!isEqual(childPropsConfig,this.childPropsConfig)){
      this.childPropsConfig=childPropsConfig
      this.setState({
        panes:map(panes, (v, i) => {
          v.childPropsConfig = get(childPropsConfig,`[${i}]`,childPropsConfig[0]);
          return v;
        })
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.changeOASetTimeout);
  }

  sortPanes = (sortPanes:PaneType[]) => this.setState({ panes: sortPanes, isSort: true }, this.outputData);


  changeObjectArrayConfig = () => {
    const {panes}=this.state
    const { dispatch, type, parentFieldPath, field} = this.props;
    if (isEmpty(panes)) {
      this.childPropsConfig=[];
    }else {
      this.childPropsConfig= map(panes, pane => pane.childPropsConfig);
    }

    this.changeOASetTimeout = setTimeout(() => dispatch!({
      type: ACTION_TYPES.addPropsConfig,
      payload:{
        childPropsConfig: this.childPropsConfig,
        parentFieldPath: formatPropsFieldConfigPath(type, field, parentFieldPath),
      }
    }), 500);

  };

  add = () => {
    const { childPropsConfig } = this.props;
    const { panes } = this.state;
    const activeKey = `object${this.nextTabIndex++}`;
    panes.push({
      key: activeKey,
      childPropsConfig: cloneDeep(get(childPropsConfig,'[0]',{})),
      value: {},
    });
    this.setState({ panes, activeKey }, this.outputData);
  };

  remove = (targetKey:string) => {
    confirmModal(() => this.removeTab(targetKey));
  };

  removeTab = (targetKey:string) => {
    let { activeKey, panes } = this.state;
    const nextPanes = filter(panes, pane => pane.key !== targetKey);
    if (activeKey === targetKey) {
      activeKey = get(nextPanes,'[0].key');
    }
    if (nextPanes.length === 0) {
      this.nextTabIndex = 0;
    }
    this.setState({ panes: nextPanes, activeKey }, this.outputData);

  };


  onDataChange = (index:number, data:any) => {
    const { panes } = this.state;
    const pane = panes[index];
    pane.value = data;
    this.setState({ panes }, this.outputData);

  };

  outputData = () => {
    const { panes } = this.state;
    const { onChange } = this.props;
    const resultData:any[] =[]
    for (let pane of panes){
      if(!isEmpty(pane.value)) resultData.push(pane.value)
    }
    this.changeObjectArrayConfig();
    onChange && setTimeout(() => onChange(resultData), 500);

  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <div className={styles['children-container']}>
        {panes.length > 0 && (
          <SortComponent
            onSortChange={this.sortPanes}
            sortData={panes}
          />
        )}
        <Tabs
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          style={{ marginBottom: '12px' }}
          onEdit={this.onEdit}
        >
          {panes.map((pane, index) => {
            const { key, value, childPropsConfig } = pane;
            const tabTitle = isEmpty(value) ? key : value[Object.keys(value)[0]];
            return (
              <TabPane forceRender tab={tabTitle} key={key}>
                <ObjectComponent
                  isHideDivider
                  {...this.props}
                  value={value}
                  childPropsConfig={childPropsConfig}
                  tabIndex={index}
                  onChange={(data:any) => this.onDataChange(index, data)}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default ObjectArrayComponent
