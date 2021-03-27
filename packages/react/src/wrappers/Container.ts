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
  DropTargetType,
  getComponentConfig, getDragSort,
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
  getDragKey,
  getIsModalChild,
  PropParentNodes,
  isVertical,
  getDragSourceVDom,
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
  const parentRootNode = useRef<HTMLElement>();
  const isModal = useMemo(() => getIsModalChild(pageConfig, domTreeKeys), [
    pageConfig,
    domTreeKeys,
  ]);
  const { setOperateState, getOperateState } = useOperate(isModal);
  const { selectedDomKeys, isSelected, propName } = useSelect(
    specialProps,
    !!mirrorModalField,
  );
  let selectedPropName = prevPropName.current;
  if (propName && isSelected) {
    prevPropName.current = propName;
    selectedPropName = propName;
  }
  const {
    setSelectedNode,
    ...events
  } = useEvents(
    parentRootNode,
    specialProps,
    isSelected,
    props,
    selectedPropName,
    index,
  );

  const dragKey = getDragKey();

  const dragOver=useCallback((event:DragEvent,propName:string)=>{
  	event.preventDefault();
    const dragKey=getDragKey();
    const {isLock}=getOperateState();
    if(selectedKey!==key||domTreeKeys.includes(dragKey)||!isLock) return ;
    setTimeout(()=>{
      const childNodeKeys=get(children,propName,[]);
      const isV=isVertical(propParentNodes.current[propName]);
      if(!childNodeKeys.length){
        getDragSort([dragKey]);
        if (isEmpty(children)) {
          setChildren({ [propName]: [dragKey] });
        } else {
          const newChildren = cloneChildNodes(childNodes);
          newChildren[propName]=[dragKey];
          setChildren(newChildren);
        }

      }else if(childNodeKeys.length===1&&childNodeKeys.includes(dragKey)){
        return;
      }else {
        const newChildren=dragSort(childNodeKeys,propParentNodes.current[propName],event,isV);
        const renderChildren=cloneChildNodes(childNodes);
        renderChildren[propName]=newChildren;
        if(!isEqual(renderChildren,children)){
          getDragSort(newChildren);
          setChildren(renderChildren);
        }
      }},200);
  },[setChildren,children,selectedKey]);

  useEffect(() => {
    if (
      !nodePropsConfig ||
      isEmpty(propParentNodes.current)
    )
      return;
    const propNameListeners = {};
    each(propParentNodes.current, (parentNode, propName) => {

      propNameListeners[propName] = {
        dragOver:(event)=>dragOver(event,propName),
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
  },[propParentNodes.current]);

  useEffect(() => {
    if(dragKey&&domTreeKeys.includes(dragKey)) return;
    const iframe = getIframe();
    parentRootNode.current = getSelectedNode(uniqueKey, iframe);
    const { index: selectedIndex } = getOperateState();
    if (
      isSelected &&
      (isEmpty(funParams || item) ||
        (isEmpty(funParams || item) && selectedIndex === index))
    ) {
      setSelectedNode(parentRootNode.current);
    }

    if (childNodes) {
      getPropParentNodes(childNodes, propParentNodes.current,index);
    }

  },[childNodes,dragKey]);

  const parentDragOver =useCallback((event: DragEvent) => {
    event.preventDefault();
    const dragKey = getDragKey();
    const {isLock}=getOperateState();
    if(selectedKey!==key||domTreeKeys.includes(dragKey)||!isLock) return ;
    const containerRootNode=propParentNodes.current[defaultPropName]||parentRootNode.current;
    const isV = isVertical(containerRootNode);

    if(isEmpty(children)){
      if(nodePropsConfig){
        setChildren({ [selectedPropName]: [dragKey] });
      }else {
        setChildren([dragKey]);
      }
      getDragSort([dragKey]);
    }else if(Array.isArray(children)) {
      if(children.length===1&&children.includes(dragKey)) return;
      const newChildren = dragSort(
        children,
        containerRootNode,
        event,
        isV,
      );
      if (!isEqual(newChildren, children)) {
        getDragSort(newChildren);
        setChildren(newChildren);
      }
    }else {
      const propChildren=  get(children, selectedPropName, []);
      if (!propChildren.includes(dragKey)) {
        const newChildren = cloneChildNodes(children);
        const childrenResult=[dragKey, ...propChildren];
        getDragSort(childrenResult);
        newChildren[selectedPropName] = childrenResult;
        setChildren(newChildren);
      }
    }
  },[children,setChildren,selectedKey]) ;

  const onParentDragEnter = useCallback((e: DragEvent) => {
    e.stopPropagation();
    const dragKey = getDragKey();
    /**
     * 如果dragKey包含在组件所属的domTreeKeys中说明当前组件为拖拽组件的祖先节点之一
     */
    if (domTreeKeys.includes(dragKey)) return;
    let isDropAble;
    if(nodePropsConfig){
      const {childNodesRule}=nodePropsConfig[selectedPropName];
      isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(`${componentName}.${selectedPropName}`));
    }else {
      isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(componentName));
    }

    setOperateState({
      dropNode: parentRootNode.current,
      isDropAble,
      index,
      isLock:true
    });
    if(!isDropAble) return;
    getDropTarget({
      propName: selectedPropName,
      selectedKey: key,
      domTreeKeys,
      childNodeKeys:Array.isArray(childNodes)?childNodes:get(childNodes,selectedPropName,[])
    });
  },[childNodes,selectedPropName]);

  useEffect(() => {
    const containerRootNode=propParentNodes.current[defaultPropName]||parentRootNode.current;
    if (isEmpty(containerRootNode)) return;
    containerRootNode.addEventListener(
      'dragover',
      parentDragOver,
    );
    containerRootNode.addEventListener('dragenter',onParentDragEnter);
    return () => {
      containerRootNode.removeEventListener('dragover', parentDragOver);
      containerRootNode.removeEventListener('dragenter',onParentDragEnter);
    };
  },[parentDragOver,onParentDragEnter]);



  const { index: selectedIndex } = getOperateState();

  if ((selectedKey !== key||selectedKey===key&&selectedIndex!==index) && !isEqual(childNodes, children)) {
    setChildren(childNodes);
  }

  const onDragEnter = useCallback((e: DragEvent, propName?: string) => {
    e.stopPropagation();
    const dragKey = getDragKey();
    if (domTreeKeys.includes(dragKey)) return;
    const {childNodesRule}=nodePropsConfig[propName];
    const isDropAble=isAllowDrop(childNodesRule)&&(!isNeedJudgeFather()||isAllowAdd(componentName));
    setOperateState({
      dropNode: propParentNodes.current[propName],
      isDropAble,
      index,
      isLock:true
    });
    if(!isDropAble) return;
    getDropTarget({
      propName,
      selectedKey: key,
      domTreeKeys,
      childNodeKeys:get(childNodes,propName,[])
    });
  },[propParentNodes.current,childNodes]);

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
      domTreeKeys.includes(dragKey),
      className,
      animateClass,
      !!dragKey&&isAllowAdd(componentName)
    ),
    onDragEnter:onParentDragEnter,
    ...events,
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
