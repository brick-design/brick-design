import React,{memo} from 'react';
import styles from './index.less';
import Pages from './Pages';
import BrickTree from "../BrickTree";

function Layers(){
    return <div className={styles['container']}>
        <Pages/>
        <BrickTree/>
    </div>;
}

export default memo(Layers);
