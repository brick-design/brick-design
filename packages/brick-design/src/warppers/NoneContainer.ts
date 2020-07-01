import { createElement, forwardRef, memo, useMemo } from 'react';
import { clearDropTarget, getComponentConfig, produce, ROOT, STATE_PROPS, useSelector } from 'brickd-core';
import {
  CommonPropsType,
  controlUpdate,
  handleEvents,
  handlePropsClassName,
  HookState,
  propAreEqual,
  stateSelector,
} from '../common/handleFuns';
import {formatSpecialProps, generateRequiredProps, getComponent} from '../utils';
import {merge} from 'lodash';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';

function NoneContainer(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: { key,domTreeKeys },
    isDragAddChild,
    ...rest
  } = allProps;
  const { componentConfigs:PageDom, propsConfigSheet } = useSelector<HookState, STATE_PROPS>(stateSelector,
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  const { isSelected } = useSelect(specialProps);
  const {dragSource, isHidden } = useDragDrop(key);
  const {dragKey,vDOMCollection}=dragSource||{}
  const componentConfigs=PageDom[ROOT]?PageDom:vDOMCollection||{}
  const { props, componentName } = componentConfigs[key]|| {};
  const { propsConfig } = useMemo(() => getComponentConfig(componentName), []);

  if (!componentName) return null;

  const onDragEnter = (e: Event) => {
    e.stopPropagation();
    if(dragKey&&domTreeKeys.includes(dragKey)){
      clearDropTarget();
    }
  };

  const { className, animateClass, ...restProps } = props || {};
  return (
    createElement(getComponent(componentName), {
      ...restProps,
      className: handlePropsClassName(key, isHidden&&!isDragAddChild,dragKey===key,className, animateClass),
      ...(isDragAddChild ?{}:{
        onDragEnter,
        ...handleEvents(specialProps, isSelected),
      }),
        ...generateRequiredProps(componentName),
        ...formatSpecialProps(props, produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, propsConfigSheet[specialProps.key]);
      })),
      draggable: true,
      /**
       * 设置组件id方便抓取图片
       */
      ref,
      ...rest,
    })
  );

}

export default memo<CommonPropsType>(forwardRef(NoneContainer), propAreEqual);
