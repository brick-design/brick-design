import React, {memo, useState, useCallback, useRef} from 'react';
import styles from './index.less';
import Icon from "../../../Components/Icon";
import {addIcon,arrowIcon} from '../../../assets';
import Resizeable, {ResizeableRefType} from "../../../Components/Resizeable";

function Pages(){
    const [isFold,setIsFold]=useState(false);
    const resizeRef=useRef<ResizeableRefType>();
    const changeFold=useCallback(()=>{

        if(!isFold){
            resizeRef.current.changeFold({heightTarget:40});
        }else {
            resizeRef.current.changeFold({isHeight:true});
        }
        setIsFold(!isFold);
    },[isFold,setIsFold]);

    return <Resizeable
        ref={resizeRef}
        minHeight={40}
        defaultHeight={100}
        bottom
        className={styles['page-container']}
    >
        <div className={styles['header-container']}>
            <span className={styles['header-name']}>页面</span>
            <div className={styles['header-right']}>
                <span style={{marginRight:10}}>1/11</span>
                <Icon icon={addIcon} className={styles['add-icon']}/>
                <Icon onClick={changeFold} icon={arrowIcon} className={`${styles['add-icon']} ${!isFold&&styles['rotate180']}`}/>
            </div>
        </div>
        <div className={styles['page-content']}>

        </div>
    </Resizeable>;
}

export default memo(Pages);
