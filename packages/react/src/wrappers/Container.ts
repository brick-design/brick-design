import {
  createElement,
  forwardRef,
  memo, useCallback,
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
import { getChildrenFields, VirtualDOMType } from '@brickd/utils';
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
  isAllowAdd, isNeedJudgeFather, isAllowDrop,
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
import { useDropAble } from '../hooks/useDropAble';
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

  const  controlUpdate=useCallback((prevState: ContainerState, nextState: ContainerState)=> {
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
  },[]);

  const { pageConfig: PageDom, dropTarget } = useSelector<
    ContainerState,
    STATE_PROPS
  >(['dropTarget', 'pageConfig'], controlUpdate);
  const { selectedKey } = dropTarget || {};
  const pageConfig = PageDom[ROOT] ? PageDom : getDragSourceVDom();
  const vNode = get(pageConfig, key, {}) as VirtualDOMType;
  const { childNodes, componentName } = vNode;

  const { props, hidden, pageState } = useCommon(vNode, rest,getChildrenFields(pageConfig,childNodes));
  const { index = 0, item, funParams } = pageState;
  const uniqueKey=`${key}-${index}`;
  useChildNodes({ childNodes, componentName, specialProps });
  const [children, setChildren] = useState<ChildNodesType | undefined>(
    childNodes,
  );
  useDropAble(componentName);
  const { mirrorModalField, nodePropsConfig,childNodesRule } = useMemo(
    () => getComponentConfig(componentName),
    [],
  );
  const nodePropNames = keys(nodePropsConfig);
  const prevPropName = useRef(
    nodePropNames.includes(defaultPropName)
      ? defaultPropName
      : nodePropNames[0],
  );
  const propParentNodes = useRef<PropParentNodes>({});
  const nodeRectsMap = useRef<NodeRectsMapType>({});
  const parentRootNode = useRef<HTMLElement>();
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState, getOperateState } = useOperate(isModal);
  const parentNodeRect = 'parentNodeRect';
  const { selectedDomKeys, isSelected, propName, lockedKey } = useSelect(
    specialProps,
    !!mirrorModalField,
  );
  let selectedPropName = prevPropName.current;
  if (propName && isSelected) {
    prevPropName.current = propName;
    selectedPropName = propName;
  }
  const {
    onClick,
    onDoubleClick,
    onMouseOver,
    onDragStart,
    setSelectedNode,
  } = useEvents(
    parentRootNode,
    specialProps,
    isSelected,
    props,
    selectedPropName,
    index,
  );

  const dragOver=(event:DragEvent,childNodes:string[],propName:string)=>{
  	event.preventDefault();
    const dragKey=getDragKey();
    if(selectedKey!==key||dragKey===key) return ;
    setTimeout(()=>{
      const isV=isVertical(propParentNodes.current[propName]);
      if(!get(children,propName,[]).includes(dragKey)){
        if (isEmpty(children)) {
          setChildren({ [propName]: [dragKey] });
        } else {
          const newChildren = cloneChildNodes(childNodes);
          newChildren[propName]=[dragKey];
          setChildren(newChildren);
        }
      }else {
        const newChildren=dragSort(dragKey,childNodes,nodeRectsMap.current,event,propName,isV);
        const renderChildren=cloneChildNodes(childNodes);
        renderChildren[propName]=newChildren;
        if(!isEqual(renderChildren,children)){
          setChildren(renderChildren);
        }
      }


  	},100);
  };

  useEffect(() => {
    if (
      !nodePropsConfig ||
      isEmpty(children) ||
      isEmpty(propParentNodes.current)
    )
      return;
    const propNameListeners = {};
    each(propParentNodes.current, (parentNode, propName) => {

      propNameListeners[propName] = {
        dragOver:(event)=>dragOver(event,children[propName],propName),
        dragEnter: (event) => onDragEnter(event, propName),
      };
      parentNode.addEventListener('dragover',propNameListeners[propName].dragOver);
      parentNode.addEventListener(
        'dragenter',
        get(propNameListeners, [propName, 'dragEnter']),
      );
    });

    return () => {
      each(propParentNodes.current, (parentNode, propName) => {
        parentNode.removeEventListener('dragover',propNameListeners[propName].dragOver);
        parentNode.removeEventListener(
          'dragenter',
          get(propNameListeners, [propName, 'dragEnter']),
        );
      });
    };
  });

  useEffect(() => {
    const { index: selectedIndex } = getOperateState();
    if (
      !getDragKey() &&
      isSelected &&
      (isEmpty(funParams || item) ||
        (isEmpty(funParams || item) && selectedIndex === index))
    ) {
      setSelectedNode(parentRootNode.current);
    }

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
      getPropParentNodes(childNodes, propParentNodes.current,index);
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
    const iframe = getIframe();
    parentRootNode.current =parentRootNode.current|| getSelectedNode( uniqueKey, iframe);
    const containerRootNode=propParentNodes.current[defaultPropName]||parentRootNode.current;
    if (isEmpty(containerRootNode)) return;
    const isV = isVertical(containerRootNode);
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      const dragKey = getDragKey();

      if(selectedKey!==key||dragKey===key) return ;
      setTimeout(() => {
        if(isEmpty(childNodes)){
          if(nodePropsConfig){
            setChildren({ [selectedPropName]: [dragKey] });
          }else {
            setChildren([dragKey]);
          }
        }else if(!nodePropsConfig) {
          const newChildren = dragSort(
            dragKey,
            children as string[],
            nodeRectsMap.current,
            event,
            defaultPropName,
            isV,
          );
          if (!isEqual(newChildren, children)) {
            setChildren(newChildren);
          }
        }else {
          if (!get(children, selectedPropName, []).includes(dragKey)) {
            const newChildren = cloneChildNodes(children);
            const childChildren = get(newChildren, selectedPropName, []);
            newChildren[selectedPropName] = [
              ...new Set([dragKey, ...childChildren]),
            ];
            setChildren(newChildren);
          }
        }

      }, 100);
    };

    containerRootNode.addEventListener(
      'dragover',
      dragOver,
    );
    containerRootNode.addEventListener('dragenter',onParentDragEnter);
    return () => {
      containerRootNode.removeEventListener('dragover', dragOver);
      containerRootNode.removeEventListener('dragenter',onParentDragEnter);
    };
  });

  const dragKey = getDragKey();


  const { index: selectedIndex } = getOperateState();

  if ((selectedKey !== key||selectedKey===key&&selectedIndex!==index) && !isEqual(childNodes, children)) {
    setChildren(childNodes);
  }

  const onParentDragEnter = (e: DragEvent) => {
    e.stopPropagation();

    const dragKey = getDragKey();
    if ( key === dragKey ||
      (nodePropsConfig && isEmpty(children)))
      return;
   let isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(componentName));
   if(nodePropsConfig){
     const {childNodesRule}=nodePropsConfig[selectedPropName];
     isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(`${componentName}.${selectedPropName}`));
   }
    setOperateState({
      dropNode: parentRootNode.current,
      isDropAble,
      index
    });
    if(!isDropAble) return;
    getDropTarget({
      propName: selectedPropName,
      selectedKey: key,
      domTreeKeys,
    });
  };

  const onDragEnter = (e: DragEvent, propName?: string) => {
    e.stopPropagation();
    const dragKey = getDragKey();
    if (key === dragKey) return;
    const {childNodesRule}=nodePropsConfig[propName];
    const isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(componentName));
    setOperateState({
      dropNode: propParentNodes.current[propName],
      isDropAble,
      index
    });
    if(!isDropAble) return;
    getDropTarget({
      propName,
      selectedKey: key,
      domTreeKeys,
    });
  };
  if (!isSelected && (!componentName || hidden)) return null;

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(
      mirrorModalField,
    );
    if(displayPropName){
      const isVisible =
        isSelected || (selectedDomKeys && selectedDomKeys.includes(key));
      modalProps = isVisible
        ? { [displayPropName]: isVisible, ...mountedProps }
        : mountedProps;
    }else {
      modalProps=mountedProps;
    }
  }
  const { className, animateClass, ...restProps } = props || {};

  return createElement(getComponent(componentName), {
    ...restProps,
    className: handlePropsClassName(
      uniqueKey,
      dragKey === key ||
        (dragKey && !isSelected && domTreeKeys.includes(lockedKey)),
      className,
      animateClass,
      !!dragKey&&isAllowAdd(componentName)
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
      { ...pageState, ...pageState.getPageState() },
      children,
    ),
    draggable: true,
    /**
     * 设置组件id方便抓取图片
     */
    ref,
    ...modalProps,
  });
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);
