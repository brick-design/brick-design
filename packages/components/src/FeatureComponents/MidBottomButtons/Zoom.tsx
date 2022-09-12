import React, { memo, useCallback } from 'react';
import { useZoom } from '@brickd/canvas';
import styles from './index.less';
import Icon from '../../Components/Icon';
import { zoom11Icon, zoomInIcon, zoomOutIcon } from '../../assets';

interface ZoomProps {
  type?: 'in' | 'out' | '11';
}

function Zoom(props: ZoomProps) {
  const { type = '11' } = props;

  const { setZoomState, getZoomState } = useZoom();
  let icon = zoom11Icon;
  if (type === 'in') {
    icon = zoomInIcon;
  } else if (type === 'out') {
    icon = zoomOutIcon;
  }

  const onClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    let { scale } = getZoomState();
    if (type === 'in') {
      scale += 0.05;
    } else if (type === 'out') {
      scale -= 0.05;
    } else {
      scale = 1;
    }
    setZoomState({ scale });
  }, []);

  return (
    <Icon
      className={styles['icon-container']}
      iconClass={styles['icon-class']}
      icon={icon}
      onClick={onClick}
    />
  );
}

export default memo(Zoom);
