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
  initPageBrickdState,
  redo,
  setPageName,
  StateType,
  undo,
} from '@brickd/core';
import {isEqual} from 'lodash';
import BrickDesign, { BrickDesignProps } from './BrickDesign';
import {
  OperateProvider,
  OperateStateType,
} from './components/OperateProvider';
import styles from './global.less';
import { getIframe } from './utils';
import { onDragover } from './common/events';
import { useSelector } from './hooks/useSelector';
import GuidelinesOut from './components/GuidelinesOut';

interface BrickDesignCanvasType extends BrickDesignProps {
  initState?: Partial<StateType>;
  pageName: string;
}

function BrickDesignCanvas(props: BrickDesignCanvasType) {
  const { onLoadEnd, pageName, initState, ...rest } = props;
  const operateStore = useRef<BrickStore<OperateStateType>>(
    new BrickStore<OperateStateType>(),
  ).current;
  const {
    platformInfo: { size },
  } = useSelector(['platformInfo']);
  const [isLoading, setIsLoading] = useState(false);
  const [scale,setScale] = useState(0.5);
  const [canvasSize,setCanvasSize]=useState(size);
  const iframeRef = useRef<HTMLIFrameElement>();
  const prevSize=useRef(size);
  const loadEnd = useCallback(() => {
    setIsLoading(true);
    onLoadEnd && onLoadEnd();
  }, [setIsLoading]);

  useEffect(() => {
    setPageName(pageName);
    initPageBrickdState(initState);
  }, [pageName]);

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
    iframeRef.current=getIframe();
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

  useEffect(()=>{
    if(!isEqual(prevSize.current,size)){
      setCanvasSize(size);
      prevSize.current=size;
    }
  });
  const changeCanvasSize=useCallback(()=>{
    const {contentDocument:{body:{scrollHeight,scrollWidth}}}=iframeRef.current;
    if(canvasSize[0]===size[0]&&canvasSize[1]===size[1]){
      setCanvasSize([scrollWidth,scrollHeight]);
    }else{
      setCanvasSize(size);

    }
  },[setCanvasSize,size,canvasSize]);

  useEffect(()=>{
    const { contentWindow } = iframeRef.current||{};
    function onKeyDown(keyEvent: KeyboardEvent) {
      keyEvent.stopPropagation();
      const { key, ctrlKey, shiftKey, metaKey } = keyEvent;
      if((ctrlKey || metaKey)){
        if (key === 'z' ) {
          if (!shiftKey) {
            undo();
          } else if (shiftKey) {
            redo();
          }
        }else  if(key==='u') {
          changeCanvasSize();
        }else if(key==='='){
          setScale(scale+0.1);
        }else if (key==='-'){
          setScale(scale-0.1);
        }
      }
      keyEvent.returnValue=false;
    }
    contentWindow&&contentWindow.addEventListener('keydown', onKeyDown);
    window.addEventListener('keydown', onKeyDown);
    return  ()=>{
      window.removeEventListener('keydown', onKeyDown);
      contentWindow&&contentWindow.removeEventListener('keydown', onKeyDown);

    };
  },[changeCanvasSize,setScale,scale]);



  const style = useMemo(
    () => ({
      width: canvasSize[0],
      minWidth: canvasSize[0],
      height: canvasSize[1],
      minHeight: canvasSize[1],
      transition: 'all 700ms',
      transform: `scale(${scale},${scale})`,
    }),
    [canvasSize, scale],
  );



  return (
    <OperateProvider value={operateStore}>
      <div className={styles['brick-design-container']} id="brickd-canvas-container">
        <div
          id="brickd-canvas"
          style={style}
          className={styles["brickd-canvas"]}
        >
          {isLoading && (
            <>
              <GuidelinesOut scale={scale} operateStore={operateStore} />
            </>
          )}
          <BrickDesign
            {...rest}
            operateStore={operateStore}
            onLoadEnd={loadEnd}
          />

        </div>
      </div>
    </OperateProvider>
  );
}

export default memo(BrickDesignCanvas);
