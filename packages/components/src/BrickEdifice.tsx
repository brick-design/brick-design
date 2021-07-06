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
import Users, { UserType } from './FeatureComponents/Users';

import TopLeftButtons from './FeatureComponents/TopLeftButtons';
import MidBottomButtons from './FeatureComponents/MidBottomButtons';
import BottomLeftButtons, { BottomLeftButtonsType } from './FeatureComponents/BottomLeftButtons';

require('rc-tabs/assets/index.css');
require('rc-collapse/assets/index.css');

const users:UserType[]=[{id:1,img:'https://img0.baidu.com/it/u=3434365774,3342884301&fm=26&fmt=auto&gp=0.jpg'},
  {id:2,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-6f1c492cbdfe3c24aae44e935a796d5a_hd.jpg&refer=http%3A%2F%2Fpic3.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=d5b06091574cfeaad248f24803a57a07'},
  {id:3,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-c524149a6e4126baf8a64cecf8eb2db3_hd.jpg&refer=http%3A%2F%2Fpic3.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=9ac7e22f4cdc72d517bb2804904e107a'},
  {id:4,img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-aa340e100936dca90213630e308a772e_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627221393&t=ca756de7e3f9e5d1932e2f22e96af75d'}
];

interface BrickEdificeProps
  extends BrickDesignCanvasType,
    BottomLeftButtonsType {
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
          <TopLeftButtons/>
          <MidBottomButtons/>
          <BottomLeftButtons componentsCategory={componentsCategory}/>
        </BrickDesignCanvas>
    </BrickProvider>
    </ZoomProvider>
  );
}

export default memo(BrickEdifice);
