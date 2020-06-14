import React, { IframeHTMLAttributes, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  clearHovered,
  ComponentConfigsType, DragSourceType,
  isContainer,
  LegoProvider,
  ROOT,
  STATE_PROPS,
  useSelector,
} from 'brickd-core';
import ReactDOM from 'react-dom';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';

export * from './common/events';

const onIframeLoad = (divContainer: any, designPage: any) => {
  const head = document.head.cloneNode(true);
  const {contentDocument}=getIframe()
  contentDocument.head.remove();
  contentDocument.documentElement.insertBefore(head, contentDocument.body);
  divContainer.current = contentDocument.body;
  componentMount(designPage,divContainer)
};

const getIframe=():any=>{
  return  document.getElementById('dnd-iframe');
}

const componentMount=(designPage:any,divContainer:any)=>{
  ReactDOM.render(
    <LegoProvider>
      {designPage}
    </LegoProvider>
  , divContainer.current);
}
const onDragEnter=(dragSource:DragSourceType,divContainer:any)=>{
    const {vDOMCollection}=dragSource
    componentMount(renderComponent(vDOMCollection!),divContainer)
}
const onDragLeave=(divContainer:any)=>{
  ReactDOM.unmountComponentAtNode(divContainer.current)

}

const renderComponent=(componentConfigs:ComponentConfigsType)=>{
  const { [ROOT]: { componentName } } = componentConfigs;
  const props = {
    specialProps: {
      domTreeKeys: [ROOT],
      key: ROOT,
      parentKey: '',
    },
  };
  return isContainer(componentName) ? <Container onMouseLeave={clearHovered} {...props} /> :
    <NoneContainer onMouseLeave={clearHovered} {...props}/>;
}
/**
 * 鼠标离开设计区域清除hover状态
 */
interface BrickDesignProps extends IframeHTMLAttributes<any> {
  onLoadEnd?: () => void,
}

const stateSelector:STATE_PROPS[]= ['componentConfigs','dragSource'];

type BrickdHookState={
  componentConfigs:ComponentConfigsType,
  dragSource:DragSourceType
}

const controlUpdate=(prevState:BrickdHookState,nextState:BrickdHookState)=> {
  const { componentConfigs: prevComponentConfigs } = prevState
  const { componentConfigs } = nextState

return !componentConfigs[ROOT]||componentConfigs[ROOT]!==prevComponentConfigs[ROOT]
}

export function BrickDesign(props: BrickDesignProps) {

  const { componentConfigs,dragSource } = useSelector<BrickdHookState,STATE_PROPS>(stateSelector,controlUpdate);
  const designPage: any = useMemo(() => {
    if (!componentConfigs[ROOT]) return null;
    return renderComponent(componentConfigs)
  }, [componentConfigs]);

  const divContainer = useRef(null);

  useEffect(() => {
    const {contentWindow} = getIframe();
    contentWindow.addEventListener('dragover', onDragover);
    contentWindow.addEventListener('drop', onDrop);
    return () => {
      contentWindow.removeEventListener('dragover', onDragover);
      contentWindow.removeEventListener('drop', onDrop);
    };
  }, []);

  useEffect(()=>{
    if(componentConfigs[ROOT]) return
    const {contentWindow} = getIframe()
    const dragEnter=()=>onDragEnter(dragSource,divContainer)
    const dragLeave=()=>onDragLeave(divContainer)
    contentWindow.addEventListener('dragenter', dragEnter);
    contentWindow.addEventListener('dragleave', dragLeave);
    return ()=>{
      contentWindow.removeEventListener('dragenter', dragEnter)
      contentWindow.removeEventListener('dragleave', dragLeave)
    }
  },[componentConfigs,dragSource,divContainer])

  useEffect(() => {
    if (divContainer.current){
      componentMount(designPage,divContainer)
    }
  }, [divContainer.current, designPage]);

  const { onLoadEnd } = props;
  return (<iframe
      id="dnd-iframe"
      style={{ border: 0, width: '100%', height: '100%' }}
      srcDoc={iframeSrcDoc}
      onLoad={useCallback(() => {
        onIframeLoad(divContainer, designPage);
        onLoadEnd && onLoadEnd();
      }, [])}
      {...props}
    />
  );
}

