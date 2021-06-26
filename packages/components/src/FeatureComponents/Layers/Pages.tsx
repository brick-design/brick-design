import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
  createLayers,
  getStore,
  changeLayer,
  useSelector,
  copyLayers, renameLayers,
} from '@brickd/canvas';
import { map, isEqual, keys } from 'lodash';
import styles from './index.less';
import Icon from '../../Components/Icon';
import {
  addIcon,
  arrowIcon,
  rightIcon,
  deleteIcon1,
  copyIcon,
} from '../../assets';
import Resizeable, { ResizeableRefType } from '../../Components/Resizeable';

interface LayerProp {
  layerName: string;
  layers: string[];
  onDelete: (layerName: string) => void;
}

const LayerItem = function (props: LayerProp) {
  const { layerName, onDelete } = props;
  const { layerName: selectLayerName } = useSelector(
    ['layerName'],
    undefined,
    undefined,
    true,
  );
  // const renameLayer=()=>{
  //
  // }
  const changeLayerName = useCallback(() => {
    if (selectLayerName !== layerName) changeLayer({ layerName });
  }, [selectLayerName]);
  const changeEdit = useCallback(
    (event: React.FormEvent) => {
      event.stopPropagation();
      const target=event.target as HTMLElement;
      target.contentEditable='true';
      target.focus();
    },
    [],
  );

  const onBlur = useCallback(
    (event: React.FormEvent) => {
      event.stopPropagation();
      const target=event.target as HTMLElement;
      renameLayers({newLayerName:target.textContent,prevLayerName:layerName});
      target.contentEditable='false';
    },
    [],
  );

  const copyPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyLayers({ layerName });
  };

  const deletePage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(layerName);
  };
  const isSelected = selectLayerName === layerName;

  return (
    <div onClick={changeLayerName} className={styles['layer-item']}>
      <img
        alt=''
        style={{ visibility: isSelected ? 'visible' : 'hidden' }}
        src={rightIcon}
        className={styles['right-icon']}
      />
      <div
        onBlur={onBlur}
        onDoubleClick={changeEdit}
        style={{ fontWeight: isSelected ? 500 : 400 }}
        className={styles['layer-text']}
      >
        {layerName}
      </div>
      <Icon
        onClick={copyPage}
        icon={copyIcon}
        iconClass={styles['icon-size']}
        className={styles['hover-icon']}
      />
      <Icon
        onClick={deletePage}
        icon={deleteIcon1}
        iconClass={styles['icon-size']}
        className={styles['hover-icon']}
      />
    </div>
  );
};

interface PageProps {
  onDelete: (layerName: string) => void;
}

function Pages(props: PageProps) {
  const { onDelete } = props;
  const [isFold, setIsFold] = useState(false);
  const brickdStore = useRef(getStore()).current;
  const { layerName } = useSelector(['layerName'], undefined, undefined, true);
  const [layers, setLayers] = useState<string[]>([]);

  const resizeRef = useRef<ResizeableRefType>();

  useEffect(() => {
    const layers = keys(brickdStore.getState());
    layers.shift();
    setLayers(layers);
    addEventListener('mousemove',resizeRef.current.onResize);
    addEventListener('mouseup',resizeRef.current.onResizeEnd);
    return ()=>{
      removeEventListener('mousemove',resizeRef.current.onResize);
      removeEventListener('mouseup',resizeRef.current.onResizeEnd);
    };
  }, []);

  useEffect(() => {
    function checkForUpdates() {
      const newLayers = keys(brickdStore.getState());
      newLayers.shift();
      if (!isEqual(newLayers, layers)) {
        setLayers(newLayers);
      }
    }
    return brickdStore.subscribe(checkForUpdates);
  }, [layers, setLayers]);

  const changeFold = useCallback(() => {
    if (!isFold) {
      resizeRef.current.changeFold({ heightTarget: 40 });
    } else {
      resizeRef.current.changeFold({ isHeight: true });
    }
    setIsFold(!isFold);
  }, [isFold, setIsFold]);

  const createPage = () => {
    createLayers({ layerName: 'Layer' + layers.length });
  };

  return (
    <Resizeable
      ref={resizeRef}
      minHeight={40}
      defaultHeight={100}
      bottom
      className={styles['page-container']}
    >
      <div className={styles['header-container']}>
        <span className={styles['header-name']}>{layerName}</span>
        <div className={styles['header-right']}>
          <span style={{ marginRight: 10 }}>{`${
            layers.indexOf(layerName) + 1
          }/${layers.length}`}</span>
          <Icon
            onClick={createPage}
            icon={addIcon}
            className={styles['add-icon']}
          />
          <Icon
            onClick={changeFold}
            icon={arrowIcon}
            className={`${styles['add-icon']} ${
              !isFold && styles['rotate180']
            }`}
          />
        </div>
      </div>
      <div className={styles['page-content']}>
        {map(layers, (v) => (
          <LayerItem
            onDelete={onDelete}
            layers={layers}
            layerName={v}
            key={v}
          />
        ))}
      </div>
    </Resizeable>
  );
}

export default memo(Pages);
