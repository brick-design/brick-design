import React, {
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  addComponent,
  // ChildNodesType,
  DropTargetType,
  getComponentConfig,
  getDropTarget,
  getSelector,
  PageConfigType,
  setDragSortCache, setDropTarget,
  STATE_PROPS,
} from '@brickd/core';
import { useCommon,
  // useForceRender
} from '@brickd/hooks';
import { getChildrenFields } from '@brickd/utils';
import { isEqual, get,
  each,
  keys, isEmpty, some } from 'lodash';
import { defaultPropName } from 'common/constants';
import {
  generateRequiredProps,
  getComponent,
  // cloneChildNodes,
  dragSort,
  getPropParentNodes,
  getDragKey,
  getIsModalChild,
  PropParentNodes,
  getDragSourceFromKey,
  isAllowAdd,
  isNeedJudgeFather,
  isAllowDrop,
  getVNode, getSelectedNode, placeholderBridgeStore, getNodeRealRect,
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
// import { useNewAddComponent } from '../hooks/useNewAddComponent';
import { useStyleProps } from '../hooks/useStyleProps';
import { useEye } from '../hooks/useEye';
/**
 * 所有的容器组件名称
 */

export type ContainerState = {
  pageConfig: PageConfigType;
  dropTarget: DropTargetType;
};
function Container(allProps: CommonPropsType) {
  const {
    specialProps,
    specialProps: { key, domTreeKeys },
    ...rest
  } = allProps;
 // const forceRender=useForceRender();
  const controlUpdate = useCallback(
    (prevState: ContainerState, nextState: ContainerState) => {
      const { pageConfig: prevPageConfig } = prevState;
      const { pageConfig } = nextState;
      // if(!isEqual(get(prevPageConfig,key+'.childNodes'),get(pageConfig,key+'.childNodes'))){
      //   // forceRender();
      //   console.log('forceRender.>>>>>>>>>>',);
      // }
      return prevPageConfig[key] !== pageConfig[key]||!isEqual(get(prevPageConfig,key+'.childNodes'),get(pageConfig,key+'.childNodes'));
    },
    [],
  );

  const { pageConfig } = useSelector<ContainerState, STATE_PROPS>(
    ['pageConfig'],
    controlUpdate,
  );
  const selfNodeRef=useRef<HTMLElement>();

  const vNode = getVNode(key);
  const { childNodes, componentName } = vNode;
  // const executeSubject=useNewAddComponent(key);
  const pageConfigs:PageConfigType={...pageConfig,...getDragSourceFromKey('template',{})};
  // const dragOverOrigin=useRef()
  const { props, hidden, pageState } = useCommon(
    vNode,
    rest,
    getChildrenFields(pageConfigs, childNodes),
  );
  const isShow= useEye(key);
  const { index = 0 } = pageState;
  const uniqueKey = `${key}-${index}`;
  useChildNodes({ childNodes, componentName, specialProps });
  // const [children, setChildren] = useState<ChildNodesType | undefined>(
  //   childNodes,
  // );
  const { mirrorModalField, nodePropsConfig, childNodesRule } = useMemo(
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
  const isModal = useMemo(() => getIsModalChild(pageConfigs, domTreeKeys), [
    pageConfigs,
    domTreeKeys,
  ]);
  const { setOperateState, getOperateState } = useOperate(isModal);
  const selectedInfo = useSelect(
    specialProps,
    !!mirrorModalField,
  );
  const { selectedDomKeys, isSelected, propName }=selectedInfo;
  let selectedPropName = prevPropName.current;
  if (propName && isSelected) {
    prevPropName.current = propName;
    selectedPropName = propName;
  }
  const {...events } = useEvents(
    specialProps,
    selectedInfo,
    props,
    componentName,
    selectedPropName,
    index,
  );


  const interceptDragOver=useCallback(()=>{
    const dragKey = getDragKey();
    const {  isDropAble, operateSelectedKey } = getOperateState();
    const dropKey= get(getDropTarget(),'dropKey');
    if (
      !isDropAble ||
      key !== dropKey ||
      dragKey === operateSelectedKey ||
      domTreeKeys.includes(dragKey)
    ) {
      return true;
    }

  },[]);


  const onParentDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if(interceptDragOver()||propParentNodes.current[selectedPropName]) return;
      const dragKey = getDragKey();
      if (isEmpty(childNodes)) {
        // if (nodePropsConfig) {
        //   // setChildren({ [selectedPropName]: [dragKey] });
        // } else {
        //   // setChildren([dragKey]);
        // }
        const {width,height}=getNodeRealRect(event.target as Element);
        placeholderBridgeStore.changePosition({node2:{width,height,isEmptyChild:true}});
        setDragSortCache([dragKey]);
      } else if (Array.isArray(childNodes)) {
        if (childNodes.length === 1 && childNodes.includes(dragKey)) return;
        const newChildren = dragSort(
          childNodes,
          event.target as HTMLElement,
          event,
        );
        if (!isEqual(newChildren, childNodes)) {
          // setChildren(newChildren);
          setDragSortCache(newChildren);
        }

      } else {
        const propChildren = get(childNodes, selectedPropName, []);

        if (!propChildren.includes(dragKey)) {
          // const newChildren = cloneChildNodes(childNodes);
          const childrenResult = [dragKey, ...propChildren];
          setDragSortCache(childrenResult);
          // newChildren[selectedPropName] = childrenResult;
          // setChildren(newChildren);
        } else {
          setDragSortCache(propChildren);
        }
      }
    },
    [selectedPropName,childNodes],
  );



  const dragOver = useCallback(
    (event: DragEvent, propName: string) => {
      event.preventDefault();
      if(interceptDragOver()) return;
      const dragKey = getDragKey();
      let childNodeKeys=childNodes;
      if(Array.isArray(childNodes)){
       childNodeKeys=childNodes;
      }else {
        childNodeKeys= get(childNodes, propName, []);
      }
        if (!childNodeKeys.length) {
          // if (isEmpty(childNodes)) {
          //   // setChildren({ [propName]: [dragKey] });
          // } else {
          //   const newChildren = cloneChildNodes(childNodes);
          //   newChildren[propName] = [dragKey];
          //   // setChildren(newChildren);
          // }
          const {width,height}=getNodeRealRect(event.target as Element);
          placeholderBridgeStore.changePosition({node2:{width,height}});
          setDragSortCache([dragKey]);
        } else if (
          childNodeKeys.length === 1 &&
          childNodeKeys.includes(dragKey)
        ) {
          return setDragSortCache(childNodeKeys);
        } else {
          const newChildren = dragSort(
            childNodeKeys,
            propParentNodes.current[propName],
            event,
          );
          // const renderChildren = cloneChildNodes(childNodes)||{};
          // renderChildren[propName] = newChildren;
          // if (!isEqual(renderChildren, childNodes)) {
          //   // setChildren(renderChildren);
          // }
          setDragSortCache(newChildren);
        }
    },
    [childNodes],
  );

  // const onDragLeave = (event: React.MouseEvent|MouseEvent) => {
  //   event.stopPropagation();
  //   // setChildren(childNodes);
  // };

  const onDrop = useCallback((event: React.DragEvent|MouseEvent) => {
    event.stopPropagation();
    const { selectedInfo } = getSelector(['selectedInfo']);
    const dragKey = getDragKey();
    if (get(selectedInfo,'selectedKey') === dragKey) return;
    setOperateState({ dropNode: null,hoverNode:null });
    addComponent();
    // executeSubject();
  }, []);

  const onParentDragEnter = useCallback(
    (event: DragEvent) => {
      event.stopPropagation();
      setDragSortCache(null);
      if(interceptDragEnter()||propParentNodes.current[selectedPropName]) return;

      let isDropAble;
      if (nodePropsConfig) {
        const { childNodesRule } = nodePropsConfig[selectedPropName];
        isDropAble =
          isAllowDrop(childNodesRule) &&
          isAllowAdd(componentName + selectedPropName);
      } else {
        isDropAble = isAllowDrop(childNodesRule) && isAllowAdd(componentName);
      }
      // isDropAble = Number.parseInt(index) === 0 && isDropAble;
      const dropNode=event.target as HTMLElement;
      setOperateState({
        dropNode,
        isDropAble,
        index,
        isLock: true,
      });

      if (!isDropAble) return;
      setDropTarget({
        propName: selectedPropName,
        dropKey: key,
        domTreeKeys,
        childNodeKeys: Array.isArray(childNodes)
          ? childNodes
          : get(childNodes, selectedPropName, []),
      });
    },
    [childNodes, selectedPropName],
  );

  const onDragEnter = useCallback(
    (event: DragEvent, propName?: string) => {
      event.stopPropagation();
      setDragSortCache(null);
      if(interceptDragEnter()) return;
      let isDropAble=true;
      if(nodePropsConfig){
        const { childNodesRule } = nodePropsConfig[propName];
        isDropAble =
          isAllowDrop(childNodesRule) &&
          (!isNeedJudgeFather() || isAllowAdd(componentName));
      }
      const dropNode=propParentNodes.current[propName];

      setOperateState({
        dropNode,
        isDropAble,
        index,
        isLock: true,
      });
      if (!isDropAble) return;

      setDropTarget({
        propName:nodePropsConfig?propName:undefined,
        dropKey: key,
        domTreeKeys,
        childNodeKeys: Array.isArray(childNodes)?childNodes:get(childNodes, propName, []),
      });
    },
    [childNodes],
  );

  useEffect(()=>{
    if(!selfNodeRef.current){
      selfNodeRef.current= getSelectedNode(key+'-'+index);
    }
    if(selfNodeRef.current){
      selfNodeRef.current.ondragenter=onParentDragEnter;
      selfNodeRef.current.ondragover=onParentDragOver;
      selfNodeRef.current.ondrop=onDrop;
    }

  },[onParentDragEnter,onParentDragOver]);

  useEffect(() => {
    if(isEmpty(childNodes)){
      return;
    }
    if (
      (Array.isArray(childNodes) &&
        propParentNodes.current[defaultPropName] === undefined) ||
      some(
        childNodes,
        (_, propName) =>
          propParentNodes.current[propName] === undefined,
      )
    ) {
      getPropParentNodes(
        childNodes,
        propParentNodes.current,
        index,
      );

      each(propParentNodes.current, (parentNode, propName) => {
        parentNode.ondragover=(event) => dragOver(event, propName);
        parentNode.ondragenter=(event) => onDragEnter(event, propName);
        // parentNode.ondragleave=onDragLeave;
        parentNode.ondrop=onDrop;
      });
    }
  }, [childNodes,dragOver,onDragEnter]);

  const interceptDragEnter=useCallback(()=>{
    const dragKey = getDragKey();
    const { operateSelectedKey } = getOperateState();
    if (
      domTreeKeys.includes(dragKey) ||
      dragKey === key ||
      dragKey === operateSelectedKey){
      setDropTarget(null);
      setOperateState({
        dropNode:null,
        isDropAble:false,
        index,
        isLock: true,
      });

      return true;
    }
  },[]);

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(
      mirrorModalField,
    );
    if (displayPropName) {
      const isVisible =
        isSelected || (selectedDomKeys && selectedDomKeys.includes(key));
      modalProps = isVisible
        ? { [displayPropName]: isVisible, ...mountedProps }
        : mountedProps;
    } else {
      modalProps = mountedProps;
    }
  }
  const { className, animateClass, ...restProps } = props || {};
  const childNodesProps = useMemo(
    () =>
      handleChildNodes(
        specialProps,
        { ...pageState, ...pageState.getPageState() },
        componentName,
        childNodes,
      ),
    [childNodes,pageState, pageState.getPageState(), specialProps],
  );

  const styleProps=useStyleProps(componentName,specialProps,handlePropsClassName(
    uniqueKey,
    // false,
    className,
    animateClass,
    isShow
  ),selectedInfo,);
  if (!isSelected && (!componentName || hidden)) return null;
  return createElement(getComponent(componentName), {
    ...styleProps,
    ...restProps,
    // onDragEnter: onParentDragEnter,
    // onDragOver: onParentDragOver,
    // // onDragLeave,
    // onDrop,
    ...events,
    ...generateRequiredProps(componentName),
    ...childNodesProps,
    draggable: true,
    ...modalProps,
  });
}

export default memo<CommonPropsType>(Container, propAreEqual);
