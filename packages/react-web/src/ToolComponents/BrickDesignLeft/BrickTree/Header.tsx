import React, { memo, useState } from 'react';
import {
  SelectedInfoBaseType,
  useSelector,
  isEqualKey,
  clearHovered,
  clearSelectedStatus,
  selectComponent,
  overTarget,
} from '@brickd/react';
import styles from './index.less';
import {
  arrowIcon,
  closeEye,
  layoutIcon,
  lockClose,
  lockOpen,
  moreIcon,
  openEye,
} from '../../../assets';
import Icon from '../../../Components/Icon';

const selectedColor = '#5E96FF';
const unSelectedColor = '#555555';
const selectedBGColor = '#F2F2F2';
const hoveredBGColor = '#F1F1F1';

interface HeaderProps {
  specialProps: SelectedInfoBaseType;
  propName?: string;
  setIsUnfold: any;
  isUnfold: boolean;
  componentName: string;
  hasChildNodes: boolean;
}

function controlUpdate(prevState, nextState, key: string) {
  return true;
}

function Header(props: HeaderProps) {
  const {
    specialProps,
    propName,
    specialProps: { key },
    setIsUnfold,
    isUnfold,
    componentName,
    hasChildNodes,
  } = props;
  const [isLock, setIsLock] = useState(false);
  const [isCloseEye, setIsCloseEye] = useState(false);
  const { selectedInfo, hoverKey } = useSelector(
    ['selectedInfo', 'hoverKey'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key),
  );
  const { propName: selectedPropName, selectedKey } = selectedInfo || {};
  const sortItemKey = propName ? `${key}${propName}` : key;
  const isSelected = isEqualKey(
    sortItemKey,
    selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey,
  );
  const isHovered = isEqualKey(sortItemKey, hoverKey);
  const color = isSelected ? selectedColor : unSelectedColor;

  const lockNode = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLock(!isLock);
  };

  const onCloseEye = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsCloseEye(!isCloseEye);
  };

  return (
    <div
      style={
        isSelected || isHovered
          ? {
              backgroundColor:
                (isSelected && selectedBGColor) ||
                (isHovered && hoveredBGColor),
            }
          : {}
      }
      className={styles['header-container']}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          if (isSelected) {
            clearSelectedStatus();
          } else {
            selectComponent({ ...specialProps, propName });
          }
        }}
        onMouseLeave={(e) => isHovered && clearHovered()}
        onMouseOver={(e: any) => {
          if (!isSelected) {
            overTarget({
              hoverKey: key,
            });
          }} }
        style={{ display: 'flex', flex: 1, alignItems: 'center', color }}
      >
        <Icon
          className={`${styles.triangle} ${isUnfold && styles.rotate180}`}
          icon={arrowIcon}
          iconClass={styles[hasChildNodes ? 'visible-icon' : 'hidden-icon']}
          onClick={(event) => {
            event.stopPropagation();
            setIsUnfold(!isUnfold);
          }}
        />

        <Icon
          className={styles['layout-icon']}
          style={{ color }}
          icon={layoutIcon}
        />
        {componentName}
      </div>
      <Icon
        onClick={lockNode}
        className={styles['item-icon']}
        icon={isLock ? lockClose : lockOpen}
      />
      <Icon
        onClick={onCloseEye}
        icon={isCloseEye ? closeEye : openEye}
        className={styles['item-icon']}
      />
      <Icon icon={moreIcon} className={styles['item-icon']} />
    </div>
  );
}

export default memo(Header);
