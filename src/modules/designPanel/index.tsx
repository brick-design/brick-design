import React, { PureComponent } from 'react';
import { reduxConnect } from '@/utils';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {ACTION_TYPES} from '@/models'
import style from './style.less';
import {Dispatch} from 'redux'
import { VirtualDOMType } from '@/types/ModelType';
import { oAllComponents } from '@/modules/designPanel/confg';
interface DesignPanelPropsType {
  dispatch?:Dispatch,
  componentConfigs?:VirtualDOMType[],
}

@reduxConnect(['componentConfigs'])
class DesignPanel extends PureComponent<DesignPanelPropsType,any> {

  onMouseLeave = () => {
    const { dispatch } = this.props;
    dispatch!({
      type: ACTION_TYPES.clearHovered,
    });
  };

  /**
   * 必须有不然onDrop失效
   */
  onDragOver=(event:any)=>{
    event.preventDefault()
  }

  onDrop=()=>{
    const {dispatch}=this.props

    dispatch!({
      type: ACTION_TYPES.addComponent
    })
  }

  render() {
    const { componentConfigs } = this.props;
    let FirstComponent = null;
    if (!isEmpty(componentConfigs)) {
      const {componentName, key } = componentConfigs![0];
      const resultProps = {
        componentConfig: componentConfigs![0],
        path: '[0]',
        domTreeKeys: [key],
      };
      FirstComponent = React.createElement(get(oAllComponents, componentName), resultProps);
    }
    return <div onMouseLeave={this.onMouseLeave} onDragOver={this.onDragOver}  onDrop={this.onDrop} id="dnd-container" className={style['dnd-container']}>
      {FirstComponent}
    </div>;
  }
}

export default  DesignPanel
