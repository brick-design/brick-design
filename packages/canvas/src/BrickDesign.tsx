import React, {
  IframeHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  PageConfigType,
  STATE_PROPS,
  getStore,
  ROOT,
  addComponent,
} from '@brickd/core';
import ReactDOM from 'react-dom';
import {
  BrickStore,
  StaticContextProvider,
  BrickObserverProvider,
} from '@brickd/hooks';
import { BrickContext } from 'components/BrickProvider';
import {
  iframeSrcDoc,
  getIframe,
  getDragKey,
  getRootState,
  setIframe,
  placeholderBridgeStore,
} from './utils';
import Distances from './components/Distances';
import GuidePlaceholder from './components/GuidePlaceholder';
import { useSelector } from './hooks/useSelector';
import StateDomainWrapper from './wrappers/StateDomainWrapper';
import {
  OperateProvider,
  OperateStateType,
} from './components/OperateProvider';
import OperationPanel from './components/OperationPanel';
import BoxModel from './components/BoxModel';
import styles from './index.less';
import { ZoomProvider } from './components/ZoomProvider';
import { FreeGuidelines } from './components/FreeGuidelines';
/**
 * 鼠标离开设计区域清除hover状态
 */
export interface BrickDesignProps extends IframeHTMLAttributes<any> {
  onLoadEnd?: () => void;
  operateStore?: BrickStore<OperateStateType>;
  [propName: string]: any;
}

type BrickdHookState = {
  pageConfig: PageConfigType;
};

const controlUpdate = (
  prevState: BrickdHookState,
  nextState: BrickdHookState,
) => {
  const { pageConfig: prevPageConfig } = prevState;
  const { pageConfig } = nextState;
  return pageConfig[ROOT] !== prevPageConfig[ROOT];
};

type LayerNameType = {
  layerName: string;
};

function BrickDesign(brickdProps: BrickDesignProps) {
  const {
    onLoadEnd,
    pageName,
    options,
    operateStore,
    zoomStore,
    ...props
  } = brickdProps;
  const { pageConfig = {} } = useSelector<BrickdHookState, STATE_PROPS>(
    ['pageConfig'],
    controlUpdate,
  );
  const iframeRef = useRef<HTMLIFrameElement>();

  useSelector<LayerNameType, string>(
    ['layerName'],
    (prevState, nextState) => {
      if (prevState.layerName !== nextState.layerName) {
        operateStore.setPageState({
          hoverNode: undefined,
          selectedNode: undefined,
          dropNode: undefined,
          isModal: undefined,
          operateHoverKey: undefined,
          operateSelectedKey: undefined,
          index: undefined,
          isDropAble: undefined,
          isLock: undefined,
        });
      }
      return false;
    },
    undefined,
    true,
  );
  const rootComponent = pageConfig[ROOT];
  console.log('rootComponent>>>>>>>>>',rootComponent);
  const staticState = useMemo(() => ({ options, pageName }), [
    pageName,
    options,
  ]);

  const onMouseLeave = useCallback((event: Event) => {
    event.stopPropagation();
    if (getDragKey()) return;
    operateStore.setPageState({
      hoverNode: null,
      operateHoverKey: null,
    });
  }, []);

  const renderComponent = useCallback((pageConfig: PageConfigType) => {
    const rootComponent = pageConfig[ROOT];
    if (!rootComponent) return null;
    const specialProps = { domTreeKeys: [ROOT], key: ROOT, parentKey: '' };
    const { layerName } = getRootState();
    return (
      <StateDomainWrapper
        {...props}
        onMouseLeave={onMouseLeave}
        specialProps={specialProps}
        key={layerName}
      />
    );
  }, []);

  const designPage = useMemo(() => renderComponent(pageConfig), [pageConfig]);
  const divContainer = useRef(null);

  const componentMount = useCallback(
    (divContainer, designPage) => {
      ReactDOM.render(
        <BrickObserverProvider>
          <ZoomProvider value={zoomStore}>
            <StaticContextProvider value={staticState}>
              <OperateProvider value={operateStore}>
                <BrickContext.Provider value={getStore()}>
                  {designPage}
                  <Distances />
                  <OperationPanel />
                  <BoxModel />
                  <GuidePlaceholder />
                  <FreeGuidelines />
                </BrickContext.Provider>
              </OperateProvider>
            </StaticContextProvider>
          </ZoomProvider>
        </BrickObserverProvider>,
        divContainer.current,
      );
    },
    [staticState],
  );

  const onDragEnter = useCallback((e) => {
    e.stopPropagation();
    const { layerName } = getRootState();

    if (!layerName) return;
    const { contentDocument } = getIframe();
    operateStore.setPageState({
      dropNode: contentDocument.body,
      isDropAble: true,
    });
    placeholderBridgeStore.changePosition({
      node2: {
        width: contentDocument.body.scrollWidth,
        height: contentDocument.body.scrollHeight,
        isEmptyChild: true,
      },
    });

  }, []);

  const onDragLeave = useCallback(() => {
    operateStore.setPageState({
      dropNode: null,
      isDropAble: false,
    });
    placeholderBridgeStore.changePosition({});
    // ReactDOM.unmountComponentAtNode(divContainer.current);
  }, []);

  const onIframeLoad = useCallback(() => {
    const head = document.head.cloneNode(true);
    const { contentDocument } = getIframe();
    contentDocument.head.remove();
    contentDocument.documentElement.insertBefore(head, contentDocument.body);
    divContainer.current = contentDocument.getElementById('dnd-container');
    componentMount(divContainer, designPage);
    onLoadEnd && onLoadEnd();
  }, [designPage, onLoadEnd, componentMount]);

  const onDragover = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(() => {
    addComponent();
    operateStore.setPageState({
      dropNode: null,
    });
    placeholderBridgeStore.changePosition({});
  }, []);

  useEffect(() => {
    if (!rootComponent) {
      const { contentWindow } = getIframe();
      contentWindow.addEventListener('dragover', onDragover);
      contentWindow.addEventListener('drop', onDrop);
      contentWindow.addEventListener('dragenter', onDragEnter);
      contentWindow.addEventListener('dragleave', onDragLeave);
    }
    return () => {
      if (!rootComponent) {
        const { contentWindow } = getIframe();
        contentWindow.removeEventListener('dragover', onDragover);
        contentWindow.removeEventListener('drop', onDrop);
        contentWindow.removeEventListener('dragenter', onDragEnter);
        contentWindow.removeEventListener('dragleave', onDragLeave);
      }
    };
  }, [onDragEnter, onDragLeave, rootComponent]);

  useEffect(() => {
    if (divContainer.current) {
      componentMount(divContainer, designPage);
    }
    setIframe(iframeRef.current);
  }, [componentMount, designPage]);

  return (
    <iframe
      id="dnd-iframe"
      ref={iframeRef}
      className={styles['canvas-mouse']}
      style={{ border: 0, width: '100%', height: '100%' }}
      srcDoc={iframeSrcDoc}
      onLoad={onIframeLoad}
      {...props}
    />
  );
}

export default memo(BrickDesign);
