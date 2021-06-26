import React, {
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
  clearHovered,
  getSelector, setDropTarget, getDropTarget,
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

interface PlatformsType {
  [platformName: string]: PlatformSizeType;
}

export interface BrickDesignCanvasType extends BrickDesignProps {
  platforms?: PlatformsType;
}


const defaultPlatforms: PlatformsType = { PC: ['100%', '100%'] };
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

  // const {onMove,onMoveStart,onMoveEnd}=useDragMove(useCallback(()=>brickdCanvasRef.current),[])

  const wheelEvent= useCallback((e:React.WheelEvent)=> {
    e.preventDefault();
    const {deltaX,deltaY}=e;
    if (Math.abs(deltaX) !== 0 && Math.abs(deltaY) !== 0) return false;
    const {scale}=getZoomState();
    if (e.ctrlKey) {
      setZoomState({scale:scale-deltaY*0.005});
    } else {
      const target=brickdCanvasRef.current;
      const {top,left}=getComputedStyle(target);
      target.style.transition='none';
      target.style.left=Number.parseInt(left)-deltaX*2+'px';
      target.style.top=Number.parseInt(top)-deltaY*2+'px';
    }
    return  false;
  },[]);

  const wheelScale= useCallback((e:WheelEvent)=> {
    if (e.ctrlKey) {
      e.preventDefault();
      const {scale}=getZoomState();
      setZoomState({scale:scale-e.deltaY*0.005});
      return false;
    }
  },[]);


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
          changeCanvasSize(true);
        } else if (key === '=') {
          scale+=0.05;

        } else if (key === '-') {
          scale-=0.05;
        }
        setZoomState({scale});
        keyEvent.returnValue = false;
      }
    }
    addEventListener('keydown', onKeyDown);
    if(contentWindow) {
      contentWindow.addEventListener('keydown', onKeyDown);
      contentWindow && contentWindow.addEventListener('wheel', wheelScale,{ passive: false });

    }

    return () => {
     removeEventListener('keydown', onKeyDown);
      if(contentWindow){
     contentWindow.removeEventListener('keydown', onKeyDown);
     contentWindow.removeEventListener('wheel', wheelScale);
      }
    };
  }, [changeCanvasSize,wheelEvent]);




  const style = useMemo(
    () => {
      const {scale}=getZoomState();
      return({
        width: size[0],
        minWidth: size[0],
        height: size[1],
        minHeight: size[1],
        transition: 'all 300ms',
        transform: `scale(${scale}})`,
      });
    },
        [size]

  );

  const cleanStatus = useCallback(() => {
    const { hoverKey } = getSelector([ 'hoverKey']);
    if (!isEmpty(getDropTarget())) {
      setDropTarget(null);
      operateStore.setPageState({
        dropNode: null,
      });
    }
    if (hoverKey) {
      clearHovered();
      operateStore.setPageState({
        hoverNode: null,
        operateHoverKey: null,
      });
    }
  }, []);
  // eslint-disable-next-line no-constant-condition
  return (
    <OperateProvider value={operateStore}>
      <div
        onWheel={wheelEvent}
        onDragEnter={cleanStatus}
        className={`${styles['brick-design-container']} ${className}`}
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
              <Guidelines
                          operateStore={operateStore} />
            </>
          )}
          <BrickDesign
            {...rest}
            operateStore={operateStore}
            onLoadEnd={loadEnd}
          />
        </div>
        {children}
      </div>
    </OperateProvider>
  );
}

export default memo(BrickDesignCanvas);
