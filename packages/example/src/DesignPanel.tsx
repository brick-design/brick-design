import React from 'react'
import styles from './index.less';
import { BrickDesign } from 'brickd';
import { useSelector } from 'brickd-core';
export default function DesignPanel(){
  const {platformInfo}=useSelector(['platformInfo'])
  const {size} = platformInfo;

  const style = {width: size[0], maxHeight: size[1], transition: 'all 700ms'};

  return (  <div style={style} className={`${styles['browser-mockup']} ${styles['with-url']}`}>
    <BrickDesign/>
  </div>)
}
