import React, { Component } from 'react';
import styles from '../index.less';
import { Icon } from '@/components';
import { ACTION_TYPES } from '@/models';
import {Dispatch} from 'redux'
import { VirtualDOMType } from '@/types/ModelType';

interface ListItemPropsType {
  dispatch:Dispatch,
  item:{templateData:VirtualDOMType},
  itemData:{
    img:string,
    id:string,
    name:string
  }
  ,
  previewImg:(img:string)=>void,
  deleteItem:(id:string)=>void

}

interface ListItemStateType {
  hovered:boolean
}

class ListItem extends Component<ListItemPropsType,ListItemStateType> {
  constructor(props:ListItemPropsType) {
    super(props);
    this.state = {
      hovered: false,
    };
  }

  onMouseOver = () => {
    this.setState({
      hovered: true,
    });
  };
  onMouseLeave = () => {
    this.setState({
      hovered: false,
    });
  };

  onDragStart=()=>{
    const {item,dispatch}=this.props
    dispatch({
      type:ACTION_TYPES.getDragData,
      payload:{
        dragData:item
      }
    })

  }

  shouldComponentUpdate(nextProps:ListItemPropsType, nextState:ListItemStateType) {
    const { hovered } = nextState;
    const { hovered: prevHovered } = this.state;
    return hovered !== prevHovered;
  }

  render() {
    const { itemData, previewImg, deleteItem } = this.props;
    const { hovered } = this.state;
    return (
      <div  draggable onDragStart={this.onDragStart} className={styles['list-item']}>
        <div onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave} className={styles['list-handler']}>
          <img style={{ width: '100%', height: '100%' }} src={itemData.img}/>
          <div style={{ visibility: hovered ? 'visible' : 'hidden' }} className={styles['list-shade']}>
            <Icon type={'eye'} onClick={() => previewImg(itemData.img)}/>
            <Icon type={'delete'} onClick={() => deleteItem(itemData.id)}/>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', clear: 'both' }}>{itemData.name}</p>
      </div>
    );
  }
}

export default  ListItem
