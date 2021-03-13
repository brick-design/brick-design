import {
  createElement,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChildNodesType,
  clearDragSource,
  DropTargetType,
  getComponentConfig,
  getDropTarget,
  PageConfigType,
  ROOT,
  STATE_PROPS,
} from '@brickd/core';
import { useCommon } from '@brickd/hooks';
import { VirtualDOMType } from '@brickd/utils';
import { isEqual, get, each, keys, isEmpty } from 'lodash';
import { defaultPropName } from 'common/constants';
import {
  generateRequiredProps,
  getComponent,
  getIframe,
  getSelectedNode,
  cloneChildNodes,
  dragSort,
  getPropParentNodes,
  NodeRectsMapType,
  getDragKey,
  getIsModalChild,
  getChildNodesRects,
  PropParentNodes,
  isVertical,
  getDragSourceVDom,
  getParentNodeRealRect,
} from '../utils';

import {
  CommonPropsType,
  handleModalTypeContainer,
  propAreEqual,
  handleChildNodes,
  handlePropsClassName,
} from '../common/handleFuns';
import { useSelect } from '../hooks/useSelect';
import { useChildNodes } from '../hooks/useChildNodes';
import { useSelector } from '../hooks/useSelector';
import { useOperate } from '../hooks/useOperate';
import { useEvents } from '../hooks/useEvents';
/**
 * 所有的容器组件名称
 */

export type ContainerState = {
  pageConfig: PageConfigType;
  dropTarget: DropTargetType;
};
function Container(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;

  function controlUpdate(prevState: ContainerState, nextState: ContainerState) {
    const {
      pageConfig: prevPageConfig,
      dropTarget: prevDropTarget,
    } = prevState;
    const { pageConfig, dropTarget } = nextState;
    return (
      prevPageConfig[key] !== pageConfig[key] ||
      (get(prevDropTarget, 'selectedKey') === key &&
        get(dropTarget, 'selectedKey') !== key) ||
      (get(prevDropTarget, 'selectedKey') !== key &&
        get(dropTarget, 'selectedKey') === key)
    );
  }
  const { pageConfig: PageDom, dropTarget } = useSelector<
    ContainerState,
    STATE_PROPS
  >(['dropTarget', 'pageConfig'], controlUpdate);
  const { selectedKey } = dropTarget || {};
  const pageConfig = PageDom[ROOT] ? PageDom : getDragSourceVDom();
  const vNode = get(pageConfig, key, {}) as VirtualDOMType;
  const { childNodes, componentName } = vNode;
  const { props, hidden, pageState } = useCommon(vNode, rest);
  const{index}=pageState;
  useChildNodes({ childNodes, componentName, specialProps });
  const [children, setChildren] = useState<ChildNodesType | undefined>(
    childNodes,
  );

  const { mirrorModalField, nodePropsConfig } = useMemo(
    () => getComponentConfig(componentName),
    [],
  );
  const nodePropNames = keys(nodePropsConfig);
  console.log('nodePropNames>>>>',nodePropNames);
  const prevPropName = useRef(
    nodePropNames.includes(defaultPropName) ? defaultPropName : nodePropNames[0],
  );
  const propParentNodes = useRef<PropParentNodes>({});
  const nodeRectsMap = useRef<NodeRectsMapType>({});
  const parentRootNode = useRef<HTMLElement>();
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState } = useOperate(isModal);
  const parentNodeRect = 'parentNodeRect';
  const {
    selectedDomKeys,
    isSelected,
    propName,
    lockedKey,
  } = useSelect(specialProps, !!mirrorModalField);

  let selectedPropName=prevPropName.current;
  if (propName && isSelected) {
    prevPropName.current = propName;
    selectedPropName=propName;
  }
  const {
    onClick,
    onDoubleClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
  } = useEvents(parentRootNode, specialProps, isSelected, selectedPropName);

  // const dragOver=(event:DragEvent,childNodes:string[],propName:string)=>{
  // 	event.preventDefault();
  // 	const childRects=map(childNodes,(key)=>nodeRectsMap.current[key]);
  // 	const isHor=isHorizontal(childRects);
  // 	setTimeout(()=>{
  // 		const newChildren=dragSort(getDragKey(),childNodes,childRects,nodeRectsMap.current[parentNodeRect] as DOMRect,event,isHor);
  // 		const renderChildren=cloneChildNodes(childNodes);
  // 				renderChildren[propName]=newChildren;
  // 		if(!isEqual(renderChildren,children)){
  // 			setChildren(renderChildren);
  // 		}
  // 	},100);
  // };

  useEffect(() => {
    if (!nodePropsConfig||
      isEmpty(children) ||
      isEmpty(propParentNodes.current)||
      index&&parseInt(index)!==0
    )
      return;
    const propNameListeners = {};
    each(propParentNodes.current, (parentNode, propName) => {
      // const isSelectedPropName=isSelected&&propName===selectedPropName;

      propNameListeners[propName] = {
        // dragOver:(event)=>dragOver(event,children[propName],propName),
        dragEnter: (event) => onDragEnter(event, propName),
      };
      // isSelectedPropName&&parentNode.addEventListener('dragover',propNameListeners[propName].dragOver);
      parentNode.addEventListener(
        'dragenter',
        get(propNameListeners, [propName, 'dragEnter']),
      );
    });

    return () => {
      each(propParentNodes.current, (parentNode, propName) => {
        // const isSelectedPropName=isSelected&&propName===selectedPropName;
        // isSelectedPropName&&parentNode.removeEventListener('dragover',propNameListeners[propName].dragOver);
        parentNode.removeEventListener(
          'dragenter',
          get(propNameListeners, [propName, 'dragEnter']),
        );
      });
    };
  });

  useEffect(() => {
    if (!parentRootNode.current && !getDragKey()) {
      const iframe = getIframe();
      parentRootNode.current = getSelectedNode(index,key, iframe);
      isSelected && setSelectedNode(parentRootNode.current);
    }
    if(index&&parseInt(index)!==0) return;
    const parentRect = parentRootNode.current
      ? getParentNodeRealRect(parentRootNode.current)
      : null;
    if (!nodeRectsMap.current[parentNodeRect] && parentRect) {
      nodeRectsMap.current[parentNodeRect] = parentRect;
    }
    const isRest =
      !isEqual(nodeRectsMap.current[parentNodeRect], parentRect) ||
      (!isEqual(children, childNodes) && !nodeRectsMap.current[getDragKey()]);
    if (childNodes) {
      getPropParentNodes(childNodes, propParentNodes.current, key);
    }
    each(propParentNodes.current, (node, propName) => {
      if (isRest) {
        nodeRectsMap.current[propName] = getParentNodeRealRect(node);
      } else if (!nodeRectsMap[propName]) {
        nodeRectsMap.current[propName] = getParentNodeRealRect(node);
      }
    });

    getChildNodesRects(
      nodeRectsMap,
      childNodes,
      propParentNodes.current,
      isRest,
    );
  });

  useEffect(() => {
    if (!isSelected||isEmpty(propParentNodes.current[defaultPropName]) || nodePropsConfig||index&&parseInt(index)!==0)
      return;
    const isV = isVertical(propParentNodes.current[defaultPropName]);
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      setTimeout(() => {
        const newChildren = dragSort(
          getDragKey(),
          children as string[],
          nodeRectsMap.current,
          event,
          defaultPropName,
          isV,
        );
        if (!isEqual(newChildren, children)) {
          console.log('setChildren1>>>>>>',componentName);
          setChildren(newChildren);
        }
      }, 100);
    };

    propParentNodes.current[defaultPropName].addEventListener(
      'dragover',
      dragOver,
    );
    return () => {
      propParentNodes.current[defaultPropName].removeEventListener(
        'dragover',
        dragOver,
      );
    };
  });

  if (selectedKey !== key && !isEqual(childNodes, children)) {

    setChildren(childNodes);
  }

  const onParentDragEnter = (e: DragEvent) => {
    e.stopPropagation();
    const dragKey = getDragKey();
    if (key === dragKey || (nodePropsConfig && isEmpty(children))||index&&parseInt(index)!==0) return;
    getDropTarget({
      propName: selectedPropName,
      selectedKey: key,
      domTreeKeys,
    });
    setOperateState({
      dropNode:
        propParentNodes.current[selectedPropName||defaultPropName] || parentRootNode.current,
    });
    setTimeout(() => {
      if (nodePropsConfig) {
        if (isEmpty(children)) {
          setChildren({ [selectedPropName]: [dragKey] });
        } else {
          if (!get(children, selectedPropName, []).includes(dragKey)) {
            const newChildren = cloneChildNodes(children);
            const childChildren = get(newChildren, selectedPropName, []);
            newChildren[selectedPropName] = [
              ...new Set([dragKey, ...childChildren]),
            ];
            console.log('setChildren4>>>>>>',componentName);

            setChildren(newChildren);
          }
        }
      } else if (Array.isArray(children)) {
        if (children.includes(dragKey)) return;

        setChildren([dragKey, ...children]);
      } else {
        setChildren([dragKey]);
      }
    }, 0);
  };

  const onDragEnter = (e: DragEvent, propName?: string) => {
    e.stopPropagation();
    const dragKey = getDragKey();
    if (key === dragKey) return;
    getDropTarget({
      propName,
      selectedKey: key,
      domTreeKeys,
    });
    setOperateState({ dropNode: propParentNodes.current[propName] });
    setTimeout(() => {
      if (isEmpty(children)) {
        setChildren({ [propName]: [dragKey] });
      } else {
        const newChildren = cloneChildNodes(childNodes);
        const childChildren = get(newChildren, propName, []);
        if (!childChildren.includes(dragKey)) {
          newChildren[propName] = [...new Set([dragKey, ...childChildren])];

          setChildren(newChildren);
        }
      }
    }, 0);

  };

  if (!isSelected && (!componentName || hidden)) return null;

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(
      mirrorModalField,
    );
    const isVisible =
      isSelected || (selectedDomKeys && selectedDomKeys.includes(key));
    modalProps = isVisible
      ? { [displayPropName]: isVisible, ...mountedProps }
      : mountedProps;
  }
  const { className, animateClass, ...restProps } = props || {};
  const dragKey = getDragKey();

  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      key,
      dragKey === key ||
        (dragKey && !isSelected && domTreeKeys.includes(lockedKey)),
      className,
      animateClass,
      index
    ),
    onMouseOver,
    onDragStart,
    onDragEnter: onParentDragEnter,
    onDoubleClick,
    onClick,
    onDragEnd: clearDragSource,
    ...generateRequiredProps(componentName),
    ...handleChildNodes(
      specialProps,
      pageConfig,
      {...pageState,...pageState.getPageState()},
      children,
    ),
    ...props,
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
    ref,
    ...modalProps,
  });
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);
