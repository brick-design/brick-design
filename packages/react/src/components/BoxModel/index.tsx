import React, { memo, useCallback, useEffect, useRef } from 'react';
import styles from './index.less';
import { useOperate } from '../../hooks/useOperate';

function BoxModel() {
  const topRef = useRef<HTMLDivElement>();
  const leftRef = useRef<HTMLDivElement>();
  const topDistanceRef = useRef<HTMLDivElement>();
  const leftDistanceRef = useRef<HTMLDivElement>();
  const { setOperateState } = useOperate();

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
      top: number,
      left: number,
      marginTop: number,
      marginLeft: number,
    ) => {
      changeBoxDisplay('flex');
      const topResult = top - marginTop,
        leftResult = left - marginLeft;
      topRef.current.style.width = width + 'px';
      topRef.current.style.top = topResult + 'px';
      topRef.current.style.left = left + 'px';
      topDistanceRef.current.style.left = width / 2 + left + 'px';
      topDistanceRef.current.style.height = marginTop + 'px';
      topDistanceRef.current.style.top = topResult + 'px';
      topDistanceRef.current.dataset.distance = 'top:' + marginTop;
      leftRef.current.style.height = height + 'px';
      leftRef.current.style.top = top + 'px';
      leftRef.current.style.left = leftResult + 'px';
      leftDistanceRef.current.style.width = marginLeft + 'px';
      leftDistanceRef.current.style.top = top + height / 2 + 'px';
      leftDistanceRef.current.style.left = leftResult + 'px';
      leftDistanceRef.current.dataset.distance = 'left:' + marginLeft;
    },
    [],
  );

  useEffect(() => {
    setOperateState({ boxChange, changeBoxDisplay });
  }, []);

  return (
    <>
      <div
        className={styles['box-top']}
        style={{ transition: 'none' }}
        ref={topRef}
      />
      <div
        className={styles['box-left']}
        style={{ transition: 'none' }}
        ref={leftRef}
      />
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
