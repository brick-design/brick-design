import React, {
  Children, cloneElement,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BrickStore,  } from '@brickd/hooks';
import {
  redo,
  undo,
  changePlatform,
  PlatformSizeType,
  // getSelector,
  setDropTarget,
  getDropTarget,
} from '@brickd/core';
import ResizePolyfill from 'resize-observer-polyfill';
import { isEmpty } from 'lodash';
import BrickDesign, { BrickDesignProps } from './BrickDesign';
import {
  OperateProvider,
  OperateStateType,
} from './components/OperateProvider';
import styles from './index.less';
import { useSelector } from './hooks/useSelector';
import Guidelines from './components/Guidelines';
import { cleanCaches, getIframe, css} from './utils';
import { useZoom } from './hooks/useZoom';
import DragMove from './components/DragMove';

interface PlatformsType {
  [platformName: string]: PlatformSizeType;
}

export interface BrickDesignCanvasType extends BrickDesignProps {
  platforms?: PlatformsType;
}


const defaultPlatforms: PlatformsType = { PC: [1920, 1080] };



function BrickDesignCanvas(props: BrickDesignCanvasType) {
  const {
    onLoadEnd,
    platforms = defaultPlatforms,
    children,
    className,
    ...rest
  } = props;
  const operateStore = useRef<BrickStore<OperateStateType>>(
    new BrickStore<OperateStateType>(),
  ).current;
  const {
    platformInfo: { platformName, size },
  } = useSelector(['platformInfo']);
  const {getZoomState,setZoomState,setSubscribe}=useZoom();

  const [isLoading, setIsLoading] = useState(false);
  const dndContainerRef = useRef<HTMLElement>();
  const brickdCanvasRef=useRef<HTMLDivElement>();
  const selectedPlatform = platforms[platformName];
  const loadEnd = useCallback(() => {
    setIsLoading(true);
    dndContainerRef.current = getIframe().contentDocument.getElementById(
      'dnd-container',
    );
    onLoadEnd && onLoadEnd();
  }, [setIsLoading]);

  useEffect(() =>{
    const unSubscribe= setSubscribe(changeScale);
    return()=>{
      cleanCaches();
      unSubscribe();
    };
  } , []);


  const changeCanvasSize = useCallback(
    (isChangePage?: any) => {
      if (typeof isChangePage === 'boolean' && isChangePage) {
        const {
          contentDocument: {
            body: { scrollHeight, scrollWidth },
          },
        } = getIframe();
        if (
          selectedPlatform[0] === size[0] &&
          selectedPlatform[1] === size[1]
        ) {
          dndContainerRef.current.style.height = 'auto';
          changePlatform({ size: [scrollWidth, scrollHeight] });
        } else {
          dndContainerRef.current.style.height = '100%';
          changePlatform({ size: selectedPlatform });
        }
      } else {
        const target = dndContainerRef.current;
        const { width, height } = css(target);
        const targetWidth = Number.parseInt(width);
        const targetHeight = Number.parseInt(height);
        if (
          (selectedPlatform[0] !== size[0] ||
            selectedPlatform[1] !== size[1]) &&
          (selectedPlatform[0] !== targetWidth ||
            selectedPlatform[1] !== targetHeight)
        ) {
          changePlatform({
            size: [
              targetWidth > selectedPlatform[0]
                ? targetWidth
                : selectedPlatform[0],
              targetHeight > selectedPlatform[1]
                ? targetHeight
                : selectedPlatform[1],
            ],
          });
        }
      }
    },
    [selectedPlatform, size],
  );

  useEffect(() => {
    const resizeObserver = new ResizePolyfill(changeCanvasSize);
    const target = dndContainerRef.current;
    target && resizeObserver.observe(target);
    return () => {
      target && resizeObserver.unobserve(target);
    };
  });

  const changeScale=useCallback(()=>{
    const {scale}=getZoomState();
    brickdCanvasRef.current.style.transform= `scale(${scale})`;
  },[]);

  useEffect(() => {
    const { contentWindow } = getIframe() || {};
    function onKeyDown(keyEvent: KeyboardEvent) {
      keyEvent.stopPropagation();
      const { key, ctrlKey, shiftKey, metaKey } = keyEvent;
      let {scale}=getZoomState();
      if (ctrlKey || metaKey) {
        if (key === 'z') {
          if (!shiftKey) {
            undo();
          } else if (shiftKey) {
            redo();
          }
        } else if (key === 'u') {
          brickdCanvasRef.current.style.transition='all 200ms';
          brickdCanvasRef.current.style.top='auto';
          brickdCanvasRef.current.style.left='auto';
          changeCanvasSize(true);
        } else if (key === '=') {
          scale+=0.05;

        } else if (key === '-') {
          scale-=0.05;
        }
        setZoomState({scale:scale||0});
        keyEvent.returnValue = false;
      }
    }
    addEventListener('keydown', onKeyDown);
    if(contentWindow) {
      contentWindow.addEventListener('keydown', onKeyDown);
    }
    return () => {
     removeEventListener('keydown', onKeyDown);
      if(contentWindow){
     contentWindow.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [changeCanvasSize]);




  const style = useMemo(
    () => {
      const {scale=0.5}=getZoomState();
      return({
        width: size[0],
        minWidth: size[0],
        height: size[1],
        minHeight: size[1],
        transform: `scale(${scale})`,
      });
    },
        [size]

  );

  const cleanStatus = useCallback(() => {
    // const { hoverKey } = getSelector([ 'hoverKey']);
    if (!isEmpty(getDropTarget())) {
      setDropTarget(null);
      operateStore.setPageState({
        dropNode: null,
      });
    }
    // if (hoverKey) {
    //   operateStore.setPageState({
    //     hoverNode: null,
    //     operateHoverKey: null,
    //   });
    // }
  }, []);
  // eslint-disable-next-line no-constant-condition
  return (
    <OperateProvider value={operateStore}>
      <div
        onDragEnter={cleanStatus}
        className={`${styles['brick-design-container']} ${className} ${styles['canvas-mouse']}`}
        id="brickd-canvas-container"
      >
        <div
          id="brickd-canvas"
          ref={brickdCanvasRef}
          style={style}
          className={styles['brickd-canvas']}
        >
          {isLoading && (
            <>
              <Guidelines/>
            </>
          )}
          <BrickDesign
            {...rest}
            operateStore={operateStore}
            onLoadEnd={loadEnd}
          />
        </div>
        <DragMove canvasRef={brickdCanvasRef}/>
        {Children.map(children,(child:any)=>cloneElement(child,{canvasRef:brickdCanvasRef}))}
      </div>
    </OperateProvider>
  );
}

export default memo(forwardRef(BrickDesignCanvas));
