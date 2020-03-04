import React from 'react';
import { reduxConnect } from '@/utils';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {ACTION_TYPES} from '@/models'
import styles from './style.less';
import {Dispatch} from 'redux'
import { PlatformInfoType, VirtualDOMType } from '@/types/ModelType';
import { oAllComponents } from '@/modules/designPanel/confg';
interface DesignPanelPropsType {
  dispatch?:Dispatch,
  componentConfigs?:VirtualDOMType[],
  platformInfo?:PlatformInfoType
}


function DesignPanel(props:DesignPanelPropsType) {

    const { componentConfigs,platformInfo,dispatch } = props;
    const {size}=platformInfo!
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

    const style={width:size[0],maxHeight:size[1], transition:'all 700ms' }

    return (<div onMouseLeave={()=>dispatch!({type:ACTION_TYPES.clearHovered})}
                onDragOver={(event)=> event.preventDefault()} // 必须有不然onDrop失效
                onDrop={()=>dispatch!({type:ACTION_TYPES.addComponent})}
                id="dnd-container"
                style={style}
                className={styles['dnd-container']}>
      {FirstComponent}
    </div>);
  }

export default  reduxConnect(['componentConfigs','platformInfo'])(DesignPanel)
