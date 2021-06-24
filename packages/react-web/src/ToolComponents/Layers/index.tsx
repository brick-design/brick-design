import React, { memo, useRef, useState } from 'react';
import { deleteLayers } from '@brickd/react';
import Pages from './Pages';
import BrickTree from './BrickTree';
import styles from './index.less';
import Tips from '../../Components/Tips';
import { warnIcon } from '../../assets';
import DragResizeBar from '../../Components/DragResizeBar';

function Layers() {
  const [visible, setVisible] = useState(false);
  const deleteLayerName = useRef<string>();

  const confirmDelete = () => {
    deleteLayers({ layerName: deleteLayerName.current });
    setVisible(!visible);
  };

  const cancelDelete = () => {
    setVisible(!visible);
    deleteLayerName.current = undefined;
  };

  const onDelete = (layerName: string) => {
    deleteLayerName.current = layerName;
    setVisible(!visible);
  };
  return (
    <DragResizeBar title={'Layers'} className={styles['container']} minWidth={212} minHeight={400}>
      <Pages onDelete={onDelete} />
      <BrickTree />
      <Tips
        icon={warnIcon}
        tip={'删除不可逆'}
        tipTitle={'注意'}
        cancelText={'取消'}
        cancelCallBack={cancelDelete}
        confirmCallBack={confirmDelete}
        confirmText={'确定'}
        visible={visible}
      />
    </DragResizeBar>
  );
}

export default memo(Layers);
