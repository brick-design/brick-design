import React, { memo, useCallback, useEffect,  useState } from 'react';
import {
  SelectedInfoBaseType,
  useSelector,
  isEqualKey,
  clearSelectedStatus,
  selectComponent,
  useOperate,
  getSelectedNode,
} from '@brickd/canvas';
import styles from './index.less';
import {
  arrowIcon,
  closeEye,
  layoutIcon,
  lockClose,
  // lockOpen,
  moreIcon,
  openEye,
} from '../../../assets';
import Icon from '../../../Components/Icon';
import Checkbox from '../../../Components/Checkbox';

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
  const { getOperateState, setOperateState, setSubscribe,executeKeyListener } = useOperate();
  const { selectedInfo } = useSelector(['selectedInfo']);
  const { propName: selectedPropName, selectedKey } = selectedInfo || {};
  const sortItemKey = propName ? `${key}${propName}` : key;
  const isSelected = isEqualKey(
    sortItemKey,
    selectedPropName ? `${selectedKey}${selectedPropName}` : selectedKey,
  );
  const [isHovered, setIsHovered] = useState(false);
  // const isHovered = isEqualKey(sortItemKey, hoverKey);
  const color = isSelected ? selectedColor : unSelectedColor;

  const lockNode = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const changeStatus = () => {
    const { operateHoverKey } = getOperateState();
    setIsHovered(isEqualKey(sortItemKey, operateHoverKey));
  };

  useEffect(() => {
    const unSubscribe = setSubscribe(changeStatus);
    return unSubscribe;
  });

  const onCloseEye = useCallback(() => {
    executeKeyListener(key);
  }, []);

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
      onMouseLeave={() =>
        isHovered && setOperateState({ hoverNode: null, operateHoverKey: null })
      }
      onMouseOver={() => {
        !isSelected &&
          setOperateState({
            hoverNode: getSelectedNode(key+'-0'),
            operateHoverKey: key,
          });
      }}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          if (isSelected) {
            clearSelectedStatus();
            setOperateState({ selectedNode: null, operateSelectedKey: null });
          } else {
            selectComponent({ ...specialProps, propName });
            setOperateState({
              selectedNode: getSelectedNode(key+'-0'),
              operateSelectedKey: key,
            });
          }
        }}
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
        // icon={isLock ? lockClose : lockOpen}
        icon={lockClose}
      />
      {!propName&&<Checkbox
        onChange={onCloseEye}
        checkedIcon={closeEye}
        uncheckedIcon={openEye}
        className={styles['item-icon']}
      />}
      <Icon icon={moreIcon} className={styles['item-icon']} />
    </div>
  );
}

export default memo(Header);
