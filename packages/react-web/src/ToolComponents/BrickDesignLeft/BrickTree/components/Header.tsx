import React, { memo } from 'react';
import { SelectedInfoBaseType,useSelector,handleSelectedStatus, onMouseOver,isEqualKey } from '@brickd/react';
import styles from '../index.less';
import {arrowIcon,layoutIcon} from '../../../../assets';
import Icon from '../../../../Components/Icon';

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

  return (
    <div
      style={{
        backgroundColor:
          (isSelected && selectedBGColor) ||
          (isHovered && hoveredBGColor) ||
          '#0000',
      }}
      className={styles['header-container']}
    >
      <div
        onClick={() =>
          handleSelectedStatus(null, isSelected, specialProps, propName)
        }
        onMouseOver={(e: any) => onMouseOver(e, sortItemKey, isSelected)}
        style={{ display: 'flex', flex: 1, alignItems: 'center', color }}
      >
        <Icon
          className={`${styles.triangle} ${isUnfold && styles.rotate90}`}
          icon={arrowIcon}
          iconClass={styles[ hasChildNodes ? 'visible-icon' : 'hidden-icon']}
          onClick={(event) => {
            event.stopPropagation();
            setIsUnfold(!isUnfold);
          }}
        />

        <Icon className={styles['layout-icon']} style={{color}} icon={layoutIcon}/>
        {componentName}
      </div>
    </div>
  );
}

export default memo(Header);
