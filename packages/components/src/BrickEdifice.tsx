import React, { memo, useEffect, useRef } from 'react';
import {
  BrickDesignCanvas,
  BrickDesignCanvasType,
  BrickProvider,
  initPageBrickdState,
  PageBrickdStateType,
  ZoomProvider
} from '@brickd/canvas';
import { BrickStore } from '@brickd/hooks';
import styles from './index.less';
import BrickDesignLeft from './FeatureComponents/BrickDesignLeft';
import { BrickPreviewPropsType } from './FeatureComponents/BrickDesignLeft/BrickPreview';
import BrickDesignRight from './FeatureComponents/BrickDesignRight';
import Layers from './FeatureComponents/Layers';
import Users, { UserType } from './FeatureComponents/Users';
import Icon from './Components/Icon';
import { downloadIcon, dragIcon, uploadIcon } from './assets';
import Styles from './FeatureComponents/Styles';
import HandleButtons from './FeatureComponents/HandleButtons';

require('rc-tabs/assets/index.css');
require('rc-collapse/assets/index.css');

const users:UserType[]=[{id:1,img:'https://img0.baidu.com/it/u=3434365774,3342884301&fm=26&fmt=auto&gp=0.jpg'},
  {id:2,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-6f1c492cbdfe3c24aae44e935a796d5a_hd.jpg&refer=http%3A%2F%2Fpic3.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=d5b06091574cfeaad248f24803a57a07'},
  {id:3,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-c524149a6e4126baf8a64cecf8eb2db3_hd.jpg&refer=http%3A%2F%2Fpic3.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=9ac7e22f4cdc72d517bb2804904e107a'},
  {id:4,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-aa340e100936dca90213630e308a772e_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=ca756de7e3f9e5d1932e2f22e96af75d'}
];

interface BrickEdificeProps
  extends BrickDesignCanvasType,
    BrickPreviewPropsType {
  initBrickdState?: PageBrickdStateType;
}
function BrickEdifice(props: BrickEdificeProps) {
  const {
    componentsCategory,
    config,
    warn,
    customReducer,
    initBrickdState,
    ...rest
  } = props;
  const zoomStore= useRef(new BrickStore({scale:0.5})).current;


  useEffect(() => {
    initBrickdState && initPageBrickdState(initBrickdState);
  }, []);

  return (
    <ZoomProvider value={zoomStore}>
    <BrickProvider config={config} warn={warn} customReducer={customReducer}>
        <BrickDesignCanvas className={styles['brickd-canvas']} {...rest}>
          <Users users={users}/>
          <div className={styles['top-left-bar']}>
          <Layers/>
            <Icon icon={uploadIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>
            <Icon icon={downloadIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>
            <Icon icon={dragIcon} className={styles['icon-Menu']} iconClass={styles['icon-class']}/>

          </div>
          <div className={styles['bottom-left-bar']}>
            <BrickDesignLeft componentsCategory={componentsCategory} />
            <BrickDesignRight />
            <Styles/>
          </div>
          <HandleButtons/>
        </BrickDesignCanvas>
    </BrickProvider>
    </ZoomProvider>
  );
}

export default memo(BrickEdifice);
