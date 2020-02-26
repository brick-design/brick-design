import React,{Component} from 'react'
import {Dropdown,Menu} from 'antd';
import styles from '@/modules/toolBar/style.less';
import { Icon } from '@/components';
import { reduxConnect } from '@/utils';
import { Dispatch } from 'redux';
import map from 'lodash/map';
import { ACTION_TYPES } from '@/models';
import { PlatformMenusType } from '@/modules/toolBar/config';
import { PlatformInfoType } from '@/types/ModelType';

interface SwitchPlatformPropsType {
  dispatch?:Dispatch,
  platformInfo?:PlatformInfoType,
  menus:PlatformMenusType
}

interface SwitchPlatformStateType {
  mobileModel:string,
  isMobile:boolean,
  isVertical:boolean
}

const MenuItem=Menu.Item
@reduxConnect()
export default class SwitchPlatform extends Component<SwitchPlatformPropsType,SwitchPlatformStateType> {

  constructor(props:SwitchPlatformPropsType){
    super(props)
    const {menus}=props
    this.state={
      isMobile:false,
      mobileModel:Object.keys(menus)[0],
      isVertical:true

    }

  }

  changePlatform=()=>{
    const {isMobile}=this.state
    this.setState({
      isMobile:!isMobile
    },this.changePlatformInfo)
  }

  changePlatformInfo=()=>{
    const {dispatch,menus}=this.props
    const {mobileModel,isVertical,isMobile}=this.state
    const size= isMobile?[...menus[mobileModel]]:['100%','100%']
    !isVertical&&(size.reverse())
    dispatch!({
      type:ACTION_TYPES.changePlatform,
      payload:{
        isMobile,
        size,
      }
    })
  }

  onSelect=({key}:any)=>{
    this.setState({
      mobileModel:key
    },this.changePlatformInfo)

  }

  renderMenu=()=>{
    const {menus}=this.props
    const {mobileModel}=this.state
    return(<Menu selectedKeys={[mobileModel]} onClick={this.onSelect}>
      {map(menus,(_,key)=>{
        return(<MenuItem key={key}>{key}</MenuItem>)
      })}
    </Menu>)
  }

  rotatePage=()=>{
    const {isVertical}=this.state
    this.setState({
      isVertical:!isVertical
    },this.changePlatformInfo)
  }

  render() {
    const {isMobile}=this.state
    const dropProps=isMobile?{}:{visible:false}
    return (
        <div className={styles['switch-container']}>
          <Dropdown overlay={this.renderMenu()} {...dropProps} trigger={['hover']} >
          <div
        className={styles['switch-platform']}
        onClick={this.changePlatform}
      >
        <Icon style={{ fontSize: 18 }} type={isMobile?'android':"windows"}/>
        <span>{isMobile?'mobile':'PC'}</span>
      </div>
          </Dropdown>
          {isMobile&&<Icon onClick={this.rotatePage} style={{fontSize:20}} type={'sync'}/>}
        </div>
      )

  }
}
