import React, { memo, useMemo, useContext } from 'react';
import { MapNodeContext, MapNodeContextProvider } from '@brickd/hooks';
import ContainerDiffWrapper, { ContainerDiff } from './ContainerDiffWrapper';

interface MapNodesRenderType extends ContainerDiff {
  item: any;
}
export function MapNodesRenderWrapper(props: MapNodesRenderType) {
  const { item, index, ...rest } = props;
  const parentMap = useContext(MapNodeContext);
  const { index: parentIndex } = parentMap || {};
  let resultIndex = index;
  if (parentIndex && parseInt(parentIndex) > 0) {
    resultIndex = `${parentIndex}${index}`;
  }

  const mapItem = useMemo(() => ({ item, index: resultIndex }), [
    resultIndex,
    item,
  ]);
  return (
    <MapNodeContextProvider key={resultIndex} value={mapItem}>
      <ContainerDiffWrapper {...rest} key={resultIndex} />
    </MapNodeContextProvider>
  );
}

export default memo(MapNodesRenderWrapper);
