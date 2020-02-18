import React, { Component, createElement } from 'react';
import { componentsToImage, OriginalComponents } from '@/configs';
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

@reduxConnect()
class DragAbleItem extends Component<DragAbleItemPropsType,any> {

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
    return <div draggable onDragStart={this.onDragStart}  className={styles.item}>
        {this.renderDragComponent()}
      </div>
  }
}

export default DragAbleItem
