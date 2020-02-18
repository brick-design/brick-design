import React, { Component, createElement } from 'react';
import { OriginalComponents } from '@/configs';
import styles from '../index.less';
import get from 'lodash/get';
import {ACTION_TYPES } from '@/models'
import {Dispatch} from 'redux'
import { reduxConnect } from '@/utils';

interface DragAbleItemPropsType {
  dispatch?:Dispatch,
  item:{
    defaultProps:any,
    componentName:string
  },
}

const defaultColors=[
  '#5237D8',
  '#46BD6F',
  '#AF4A86',
  '#FF8C00',
  '#EE3A8C',
  '#8470FF',
  '#FFD700',
  '#7D26CD',
  '#7FFFD4',
  '#008B8B'
]

@reduxConnect()
class DragAbleItem extends Component<DragAbleItemPropsType,any> {
  randomIndex:number

  constructor(props:DragAbleItemPropsType){
    super(props)
    this.randomIndex=Math.floor(Math.random()*10);
  }


  shouldComponentUpdate() {
    return false;
  }

  renderDragComponent = () => {
    const {
      item: { defaultProps, componentName },
    } = this.props;
    if(!defaultProps){
      return componentName
    }
    return createElement(get(OriginalComponents, componentName, componentName), defaultProps);
  };

  onDragStart=()=>{
    const {item,dispatch}=this.props
    dispatch!({
      type:ACTION_TYPES.getDragData,
      payload:{
        dragData:item
      }
    })

  }

  render() {
    const {item: { defaultProps}}=this.props
    // 没有设置默认属性说明组件无法展示，设置背景色
    const style=!defaultProps?{
      backgroundColor:defaultColors[this.randomIndex],
      border:0
    }:undefined
    return <div draggable
                onDragStart={this.onDragStart}
                className={styles.item}
                style={style}
    >
        {this.renderDragComponent()}
      </div>
  }
}

export default DragAbleItem
