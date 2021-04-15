import React, { memo, useCallback, useEffect, useRef } from 'react';
import styles from './index.less';
import { useOperate } from '../../hooks/useOperate';
import { changeElPositionAndSize } from '../../utils';

function BoxModel() {
  const topRef = useRef<HTMLDivElement>();
  const leftRef = useRef<HTMLDivElement>();
  const topDistanceRef = useRef<HTMLDivElement>();
  const leftDistanceRef = useRef<HTMLDivElement>();
  const { setOperateState, getOperateState } = useOperate();

  const changeBoxDisplay = useCallback((display: string) => {
    topRef.current.style.display = display;
    topDistanceRef.current.style.display = display;
    leftRef.current.style.display = display;
    leftDistanceRef.current.style.display = display;
  }, []);

  const boxChange = useCallback(
    (
      width: number,
      height: number,
      pageTop: number,
      pageLeft: number,
      positions: any,
      isFlowLayout: boolean,
    ) => {
      const { lockedMarginLeft, lockedMarginTop } = getOperateState();
      const {
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        top,
        left,
      } = positions;
      let topResult = pageTop - marginTop;
      const leftResult = pageLeft - marginLeft;
      if (isFlowLayout) {
        changeBoxDisplay('flex');
        if (!lockedMarginLeft) {
          changeElPositionAndSize(leftDistanceRef.current, {
            left: marginLeft > 0 ? leftResult : pageLeft,
            top: pageTop + height / 2,
            width: Math.abs(marginLeft),
          });
          leftDistanceRef.current.dataset.distance = 'marginLeft:' + marginLeft;
          if (!lockedMarginTop) {
            changeElPositionAndSize(topRef.current, {
              left: marginLeft > 0 ? leftResult : pageLeft,
              top: topResult,
              width: Math.abs(
                marginLeft > 0
                  ? width + marginLeft
                  : -marginLeft < width
                  ? width
                  : marginLeft,
              ),
            });
            changeElPositionAndSize(leftRef.current, {
              left: marginLeft > 0 ? leftResult : pageLeft - marginLeft,
              top: marginTop > 0 ? topResult : pageTop,
              height: Math.abs(
                marginTop > 0
                  ? marginTop + height
                  : -marginTop < height
                  ? height
                  : marginTop,
              ),
            });
            changeElPositionAndSize(topDistanceRef.current, {
              left: width / 2 + pageLeft,
              top: marginTop > 0 ? topResult : pageTop,
              height: Math.abs(marginTop),
            });
            topDistanceRef.current.dataset.distance = 'marginTop:' + marginTop;
          } else {
            topResult = pageTop + height + marginBottom;
            changeElPositionAndSize(topRef.current, {
              left: marginLeft > 0 ? leftResult : pageLeft,
              top: topResult,
              width: Math.abs(
                marginLeft > 0
                  ? width + marginLeft
                  : -marginLeft < width
                  ? width
                  : marginLeft,
              ),
            });
            changeElPositionAndSize(topDistanceRef.current, {
              left: width / 2 + pageLeft,
              top: marginBottom > 0 ? pageTop + height : topResult,
              height: Math.abs(marginBottom),
            });
            topDistanceRef.current.dataset.distance =
              'marginBottom:' + marginBottom;
            changeElPositionAndSize(leftRef.current, {
              left: marginLeft > 0 ? leftResult : pageLeft - marginLeft,
              top: marginBottom + height > 0 ? pageTop : topResult,
              height: Math.abs(
                marginBottom > 0
                  ? marginBottom + height
                  : -marginBottom < height
                  ? height
                  : marginBottom,
              ),
            });
          }
        } else {
          changeElPositionAndSize(leftDistanceRef.current, {
            left:
              marginRight > 0
                ? pageLeft + width
                : pageLeft + width + marginRight,
            top: pageTop + height / 2,
            width: Math.abs(marginRight),
          });
          leftDistanceRef.current.dataset.distance =
            'marginRight:' + marginRight;

          if (!lockedMarginTop) {
            changeElPositionAndSize(topRef.current, {
              left:
                marginRight + width > 0
                  ? pageLeft
                  : marginRight + pageLeft + width,
              top: topResult,
              width: Math.abs(
                marginRight > 0
                  ? width + marginRight
                  : marginRight + width > 0
                  ? width
                  : marginRight,
              ),
            });
            changeElPositionAndSize(topDistanceRef.current, {
              left: width / 2 + pageLeft,
              top: marginTop > 0 ? topResult : pageTop,
              height: Math.abs(marginTop),
            });
            topDistanceRef.current.dataset.distance = 'marginTop:' + marginTop;
            changeElPositionAndSize(leftRef.current, {
              left: pageLeft + width + marginRight,
              top: marginTop > 0 ? topResult : pageTop,
              height: Math.abs(
                marginTop > 0
                  ? marginTop + height
                  : -marginTop < height
                  ? height
                  : marginTop,
              ),
            });
          } else {
            topResult = pageTop + height + marginBottom;
            changeElPositionAndSize(topRef.current, {
              left:
                marginRight + width > 0
                  ? pageLeft
                  : marginRight + pageLeft + width,
              top: topResult,
              width: Math.abs(
                marginRight > 0
                  ? width + marginRight
                  : -marginRight < width
                  ? width
                  : marginRight,
              ),
            });
            changeElPositionAndSize(topDistanceRef.current, {
              left: width / 2 + pageLeft,
              top: marginBottom > 0 ? pageTop + height : topResult,
              height: Math.abs(marginBottom),
            });
            topDistanceRef.current.dataset.distance =
              'marginBottom:' + marginBottom;
            changeElPositionAndSize(leftRef.current, {
              left: pageLeft + width + marginRight,
              top: marginBottom + height > 0 ? pageTop : topResult,
              height: Math.abs(
                marginBottom > 0
                  ? marginBottom + height
                  : -marginBottom < height
                  ? height
                  : marginBottom,
              ),
            });
          }
        }
      } else {
        changeElPositionAndSize(leftDistanceRef.current, {
          left: left > 0 ? pageLeft - left : pageLeft,
          top: pageTop + height / 2,
          width: Math.abs(left),
          display: 'flex',
        });
        leftDistanceRef.current.dataset.distance = 'left:' + left;

        changeElPositionAndSize(topDistanceRef.current, {
          left: width / 2 + pageLeft,
          top: top > 0 ? pageTop - top : pageTop,
          height: Math.abs(top),
          display: 'flex',
        });
        topDistanceRef.current.dataset.distance = 'top:' + top;
      }
    },
    [],
  );

  useEffect(() => {
    setOperateState({ boxChange, changeBoxDisplay });
  }, []);

  return (
    <>
      <div className={styles['box-top']} ref={topRef} />
      <div className={styles['box-left']} ref={leftRef} />
      <div
        className={styles['distances-v']}
        style={{ transition: 'none' }}
        ref={topDistanceRef}
      />
      <div
        className={styles['distances-h']}
        style={{ transition: 'none' }}
        ref={leftDistanceRef}
      />
    </>
  );
}

export default memo(BoxModel);
