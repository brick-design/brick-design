import React, { useState, memo } from 'react';
import { map } from 'lodash';
import Collapse, { Panel } from 'rc-collapse';
import styles from './index.less';

interface CategoryInfoType<F, D> {
  [key: string]: any;
}

interface CategoriesType<T, F, D> {
  [key: string]: CategoryInfoType<F, D>;
}
interface NCollapseProps<T, F, D> {
  categories?: CategoriesType<T, F, D>;
  header?: any;
  renderItem?: (data?: any, index?: any) => void;
  className?: string;
  panelContentClass?: string;
  style?: React.CSSProperties;
  headerClass?: string;
  collapseClass?: string;
}
function NCollapse<T, F, D>(props: NCollapseProps<T, F, D>) {
  const {
    categories,
    header,
    renderItem,
    className,
    panelContentClass,
    style,
    headerClass,
    collapseClass,
  } = props;
  const [openKeys = [], setOpenKeys] = useState<any[]>([]);
  const onChange=(keys:any)=>{setOpenKeys(keys);};
  return (
    <div style={style} className={`${styles['fold-container']} ${className}`}>
      <Collapse
        className={collapseClass}
        activeKey={openKeys}
        style={{ border: 0 }}
        onChange={onChange}
      >
        {map(categories, (categoryInfo, categoryName) => {
          const isFold = openKeys.includes(categoryName);
          return (
            <Panel
              headerClass={`${styles['fold-panel-header']} ${headerClass}`}
              style={{ border: 0, padding: 0 }}
              header={header(categoryName, isFold)}
              key={categoryName}
              showArrow={false}
            >
              <div className={`${styles['fold-content']} ${panelContentClass}`}>
                {map(categoryInfo, renderItem)}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

export default memo(NCollapse);
