import { createElement, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import {
  DragSourceType,
  DropTargetType,
  getAddPropsConfig,
  LEGO_BRIDGE,
  produce,
  PropsNodeType,
  useSelector,
} from 'brickd-core';

import {
  CommonPropsType,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  HookState,
  propAreEqual,
} from '../common/handleFuns';
import { useCommon } from '../hooks/useCommon';
import { getDropTargetInfo, handleSelectedStatus } from '..';
import { useHover } from '../hooks/useHover';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';

/**
 * 所有的容器组件名称
 */
function Container(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: {
      key,
      domTreeKeys,
    },
    ...rest
  } = allProps;

  const { componentConfigs, propsConfigSheet } = useCommon(key);
  const {props, childNodes, componentName} = componentConfigs[key]||{}
const {dragSource,dropTarget,isHidden}=useDragDrop(key)
  const [children, setChildren] = useState(childNodes);
  const isHovered = useHover(key);
  const { selectedDomKeys, isSelected } = useSelect(specialProps);
  const { mirrorModalField, propsConfig, nodePropsConfig, childNodesRule, isOnlyNode, isRequired } = useMemo(() => get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName), []);

  useEffect(() => {
    /**
     * 如果组件为选中状态那就更新selectedInfo
     */
    if (nodePropsConfig && componentName) {
      for (const prop of Object.keys(nodePropsConfig)) {
        const { isRequired } = nodePropsConfig[prop];
        if (isRequired && (childNodes as PropsNodeType)[prop].length === 0) {
          handleSelectedStatus(null, false, specialProps, prop);
          break;
        }
      }
    } else if (isRequired && childNodes!.length == 0) {
      handleSelectedStatus(null, false, specialProps);

    }
  }, [childNodes]);

  const onDragEnter = (e: Event) => {
    e.stopPropagation();
    const { dragKey, parentKey } = dragSource;
    if (dragKey && !domTreeKeys.includes(dragKey) && !selectedDomKeys) {
      let propName;
      if (parentKey !== key) {
        if (Array.isArray(childNodes)) {
          setChildren([...childNodes, dragKey]);
        } else {
          setChildren(produce(childNodes, oldChild => {
            propName = Object.keys(oldChild!)[0];
            oldChild![propName] = [...oldChild![propName], dragKey];
          }));
        }
      }
      getDropTargetInfo(e, domTreeKeys, key, propName);
    }
  };

  useEffect(() => {
    setChildren(childNodes);
  }, [childNodes]);

  if ((!dropTarget || dropTarget.selectedKey !== key) && children !== childNodes) {
    setChildren(childNodes);
  }

  if (!componentName) return null;

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(mirrorModalField, 'dnd-iframe');
    const isVisible = isSelected || selectedDomKeys && selectedDomKeys.includes(key);
    modalProps = { [displayPropName]: isVisible, ...mountedProps };
  }

  const { className, animateClass, ...restProps } = props || {};
  return (
    createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
      ...restProps,
      className: handlePropsClassName(isSelected, isHovered,isHidden, className, animateClass),
      ...handleEvents(specialProps, isSelected, childNodes),
      onDragEnter,
      ...handleChildNodes(domTreeKeys, key, componentConfigs, children!),
      ...formatSpecialProps(props, produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, getAddPropsConfig(propsConfigSheet, key));
      })),
      draggable: true,
      /**
       * 设置组件id方便抓取图片
       */
      id: isSelected ? 'select-img' : undefined,
      ref,
      ...rest,
      ...modalProps,
    })
  );
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);


