import React,{Component} from 'react'
import styles from '@/modules/toolBar/style.less';
import { Icon } from '@/components';
import { reduxConnect } from '@/utils';
import { Dispatch } from 'redux';
import { ACTION_TYPES } from '@/models';

interface SwitchPlatformType {
  dispatch?:Dispatch,
  isMobile?:boolean
}
@reduxConnect(['isMobile'])
export default class SwitchPlatform extends Component<SwitchPlatformType,any> {

  changePlatform=()=>{
    const {dispatch}=this.props
    dispatch!({
      type:ACTION_TYPES.changePlatform
    })
  }

  render() {
    const {isMobile}=this.props
    return <div
      className={styles['switch-platform']}
      onClick={this.changePlatform}
    >
      <Icon style={{ fontSize: 18 }} type={isMobile?'android':"windows"}/>
      <span>{isMobile?'mobile':'PC'}</span>
    </div>;
  }
}
