import { createElement, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import { clearDropTarget, getAddPropsConfig, LEGO_BRIDGE, produce, STATE_PROPS, useSelector } from 'brickd-core';

import {
  CommonPropsType,
  controlUpdate,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  HookState,
  propAreEqual,
  stateSelector,
} from '../common/handleFuns';
import { getDropTargetInfo } from '..';
import { useHover } from '../hooks/useHover';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useChildNode } from '../hooks/useChildNode';

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

  const { componentConfigs, propsConfigSheet } = useSelector<HookState, STATE_PROPS>(stateSelector,
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  const { props, childNodes, componentName } = componentConfigs[key] || {};
  useChildNode({ childNodes, componentName, specialProps });
  const { dragSource, dropTarget, isHidden } = useDragDrop(key);
  const [children, setChildren] = useState(childNodes);
  const isHovered = useHover(key);
  const { selectedDomKeys, isSelected } = useSelect(specialProps);
  const { mirrorModalField, propsConfig } = useMemo(() => get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName), []);
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
  const onDragLeave = (e: Event) => {
    e.stopPropagation();
    const { selectedKey } = dropTarget||{};
    if (selectedKey === key) {
      // clearDropTarget();
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
      className: handlePropsClassName(isSelected, isHovered, isHidden, className, animateClass),
      ...handleEvents(specialProps, isSelected, childNodes),
      onDragEnter,
      onDragLeave,
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


