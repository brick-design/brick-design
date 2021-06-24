import { createElement, memo, useEffect, useRef } from 'react';
import { useCommon } from '@brickd/hooks';
import {
  CommonPropsType,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import {
  generateRequiredProps,
  getComponent,
  getDragKey,
  getDragSourceFromKey,
  getSelectedNode, getVNode,
} from '../utils';
import { useSelect } from '../hooks/useSelect';
import { useEvents } from '../hooks/useEvents';

function NoneContainer(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;
  const { isSelected } = useSelect(specialProps);
  const vNode = getVNode(key);
  const { componentName } = vNode;
  const dragKey = getDragKey();
  const isAddComponent = useRef(
    !getDragSourceFromKey('parentKey') && dragKey === key,
  );
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const { index = 0, funParams, item } = pageState;
  const uniqueKey = `${key}-${index}`;
  const { setSelectedNode, ...events } = useEvents(
    specialProps,
    isSelected,
    props,
    componentName,
  );

  useEffect(() => {
    if (dragKey && domTreeKeys.includes(dragKey)) return;
    if (isAddComponent.current) {
      setSelectedNode(getSelectedNode(uniqueKey));
      isAddComponent.current = false;
    }
  }, [funParams, isSelected, item, dragKey]);

  if (!isSelected && (!componentName || hidden)) return null;
  const { className, animateClass, ...restProps } = props || {};
  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      uniqueKey,
      !!dragKey,
      className,
      animateClass,
    ),
    ...events,
    ...generateRequiredProps(componentName),
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
  });
}

export default memo<CommonPropsType>(NoneContainer, propAreEqual);
