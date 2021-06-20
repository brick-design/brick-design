import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BrickStore } from '@brickd/hooks';
import {
  addComponent,
  redo,
  undo,
  initPageBrickdState, PageBrickdStateType, changePlatform, PlatformSizeType,
} from '@brickd/core'
import BrickDesign, { BrickDesignProps } from './BrickDesign';
import {
  OperateProvider,
  OperateStateType,
} from './components/OperateProvider';
import styles from './index.less';
import { css, getIframe } from './utils'
import { onDragover } from './common/events';
import { useSelector } from './hooks/useSelector';
import Guidelines from './components/Guidelines';
import ResizePolyfill from 'resize-observer-polyfill';

interface PlatformsType{
  [platformName:string]:PlatformSizeType
}

export interface BrickDesignCanvasType extends BrickDesignProps {
  initBrickdState?:PageBrickdStateType
  platforms?:PlatformsType
}

const defaultPlatforms:PlatformsType={PC:[1920, 1080]}
function BrickDesignCanvas(props: BrickDesignCanvasType) {
  const { onLoadEnd,initBrickdState,platforms=defaultPlatforms,children,className, ...rest } = props;
  const operateStore = useRef<BrickStore<OperateStateType>>(
    new BrickStore<OperateStateType>(),
  ).current;
  const {
    platformInfo: {platformName, size },
  } = useSelector(['platformInfo']);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(0.4);
  const iframeRef = useRef<HTMLIFrameElement>();
  const dndContainerRef=useRef<HTMLElement>();
  const selectedPlatform=platforms[platformName];
  const loadEnd = useCallback(() => {
    setIsLoading(true);
    dndContainerRef.current=iframeRef.current.contentDocument.getElementById('dnd-container')
    onLoadEnd && onLoadEnd();
  }, [setIsLoading]);

  useEffect(() => {
    function onMouseWheel(mousewheel: WheelEvent) {
      mousewheel.stopPropagation();
      return false;
    }
    window.addEventListener('mousewheel', onMouseWheel);
    return () => {
      window.removeEventListener('mousewheel', onMouseWheel);
    };
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.stopPropagation();
    operateStore.setPageState({ dropNode: null });
    addComponent();
  }, []);

  useEffect(() => {
    initBrickdState&&initPageBrickdState(initBrickdState)
    iframeRef.current = getIframe();
    const { contentWindow } = iframeRef.current;
    contentWindow.addEventListener('dragover', onDragover);
    window.addEventListener('dragover', onDragover);
    contentWindow.addEventListener('drop', onDrop);
    window.addEventListener('drop', onDrop);
    return () => {
      contentWindow.removeEventListener('dragover', onDragover);
      contentWindow.removeEventListener('drop', onDrop);
      window.removeEventListener('dragover', onDragover);
      window.removeEventListener('drop', onDrop);
    };
  }, []);


  const changeCanvasSize = useCallback((isChangePage?:any) => {

    if(typeof isChangePage==='boolean'&&isChangePage){
      const {
        contentDocument: {
          body: { scrollHeight, scrollWidth },
        },
      } = iframeRef.current;
    if (selectedPlatform[0] === size[0] && selectedPlatform[1] === size[1]) {
      changePlatform({size:[scrollWidth, scrollHeight]});
    } else {
      changePlatform({size:selectedPlatform});
    }
    }else {
      const target=dndContainerRef.current
      const {width,height}=css(target);
      const targetWidth=Number.parseInt(width)
      const targetHeight=Number.parseInt(height)
      if((selectedPlatform[0] !== size[0]||selectedPlatform[1] !== size[1])&&
        (selectedPlatform[0]!==targetWidth||selectedPlatform[1]!==targetHeight)){
        changePlatform({size:[targetWidth>selectedPlatform[0]?targetWidth:selectedPlatform[0], targetHeight>selectedPlatform[1]?targetHeight:selectedPlatform[1]]})
      }
    }
  }, [selectedPlatform,size]);

  useEffect(()=>{
    const resizeObserver=new ResizePolyfill(changeCanvasSize)
    const target=dndContainerRef.current
    target&&resizeObserver.observe(target)
    return ()=>{
      target&&resizeObserver.unobserve(target)

    }
  })

  useEffect(() => {
    const { contentWindow } = iframeRef.current || {};
    function onKeyDown(keyEvent: KeyboardEvent) {
      keyEvent.stopPropagation();
      const { key, ctrlKey, shiftKey, metaKey } = keyEvent;
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
          setScale(scale + 0.05);
        } else if (key === '-') {
          setScale(scale - 0.05);
        }
        keyEvent.returnValue = false;
      }
    }
    contentWindow && contentWindow.addEventListener('keydown', onKeyDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      contentWindow && contentWindow.removeEventListener('keydown', onKeyDown);
    };
  }, [changeCanvasSize, setScale, scale]);

  const style = useMemo(
    () => ({
      width:size[0],
      minWidth: size[0],
      height:size[1],
      minHeight: size[1],
      transition: 'all 700ms',
      transform: `scale(${scale})`,
    }),
    [size, scale],
  );

  return (
    <OperateProvider value={operateStore}>
      <div
        className={`${styles['brick-design-container']} ${className}`}
        id="brickd-canvas-container"
      >
        <div
          id="brickd-canvas"
          style={style}
          className={styles['brickd-canvas']}
        >
          {isLoading && (
            <>
              <Guidelines scale={scale} operateStore={operateStore} />
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
