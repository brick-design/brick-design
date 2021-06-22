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
  redo,
  undo,
  changePlatform,
  PlatformSizeType,
  clearDropTarget,
  clearHovered,
  getSelector,
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
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(0.5);
  const dndContainerRef = useRef<HTMLElement>();
  const selectedPlatform = platforms[platformName];
  const loadEnd = useCallback(() => {
    setIsLoading(true);
    dndContainerRef.current = getIframe().contentDocument.getElementById(
      'dnd-container',
    );
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



  useEffect(() => {
     return  cleanCaches;
  }, []);

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

  useEffect(() => {
    const { contentWindow } = getIframe() || {};
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
      width: size[0],
      minWidth: size[0],
      height: size[1],
      minHeight: size[1],
      transition: 'all 700ms',
      transform: `scale(${scale})`,
    }),
    [size, scale],
  );

  const cleanStatus = useCallback((e: React.DragEvent) => {
    const { dropTarget, hoverKey } = getSelector(['dropTarget', 'hoverKey']);
    if (!isEmpty(dropTarget)) {
      clearDropTarget();
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
  return (
    <OperateProvider value={operateStore}>
      <div
        onDragEnter={cleanStatus}
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
