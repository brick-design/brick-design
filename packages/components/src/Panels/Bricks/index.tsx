import React, { memo } from 'react';
import BrickPreview, { BrickPreviewPropsType } from './BrickPreview';
import BrickTemplates from './BrickTemplates';
import styles from './index.less';
import { componentIcon } from '../../assets';
import BarTabs, { TabPane } from '../../Components/BarTabs';

type BrickDesignLeftProps = BrickPreviewPropsType;

function Bricks(props: BrickDesignLeftProps) {
  const { componentsCategory } = props;

  return (
    <BarTabs icon={componentIcon} className={styles['left-container']}>
      <TabPane tab={'组件'} key={'1'}>
        <BrickPreview componentsCategory={componentsCategory} />
      </TabPane>
      <TabPane tab={'模板'} key={'2'}>
        <BrickTemplates />
      </TabPane>
    </BarTabs>
  );
}

export default memo(Bricks);
