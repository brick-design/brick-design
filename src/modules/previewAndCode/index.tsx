import React, { Component } from 'react';
import { Icon } from '@/components';
import  Code  from './components/code';
import Preview from './components/preview'
import styles from './styles.less';
import { Resizable } from 're-resizable';
import { VirtualDOMType } from '@/types/ModelType';

interface PreviewAndCodePropsType {
  visible:boolean,
  controlModal:()=>void,
  componentConfigs:VirtualDOMType[],
  isMobile?:boolean
}
export default class PreviewAndCode extends Component<PreviewAndCodePropsType> {


  shouldComponentUpdate(nextProps:PreviewAndCodePropsType){
    const {visible}=nextProps
    return visible
  }

  renderHeader = () => {
    const { controlModal} = this.props;
    return (
      <div onClick={controlModal} className={`${styles['preview-header']}  box-line-shadow`}>
        <Icon type='left' style={{ marginRight: 7 }}/>
        Preview
      </div>);

  };


  render() {
    const { componentConfigs = [],visible,isMobile } = this.props;
    if(!visible) return null
    return (
      <>
        {this.renderHeader()}
          <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row' }}>
            <Resizable
              defaultSize={{ width: '260px',height:'100%' }}>
              <Code  componentConfigs={componentConfigs} />
            </Resizable>
            <div className={styles['page-container']}>
              <Preview isMobile={isMobile} componentConfigs={componentConfigs}/>
            </div>
          </div>
      </>
    );
  }
}

