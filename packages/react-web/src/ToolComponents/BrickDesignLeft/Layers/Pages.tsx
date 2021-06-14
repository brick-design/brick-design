import React, {memo} from 'react';
import styles from './index.less';
import Icon from "../../../Components/Icon";
import {addIcon,arrowIcon} from '../../../assets';
import Resizeable from "../../../Components/Resizeable";

function Pages(){

    return <Resizeable
        minHeight={40}
        bottom
        className={styles['page-container']}
    >
        <div className={styles['header-container']}>
            <span className={styles['header-name']}>页面</span>
            <div className={styles['header-right']}>
                <span>1/11</span>
                <Icon icon={addIcon} className={styles['add-icon']}/>
                <Icon icon={arrowIcon} className={styles['add-icon']}/>
            </div>
        </div>
        <div className={styles['page-content']}>

        </div>
    </Resizeable>;
}

export default memo(Pages);
