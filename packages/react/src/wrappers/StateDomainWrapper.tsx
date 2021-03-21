import React, { memo, useMemo } from 'react';

import {
  useService,
  useRedux,
  PropsProvider,
  BrickStoreProvider,
  useGetProps,
} from '@brickd/hooks';
import { STATE_PROPS, isContainer } from '@brickd/core';

import ContainerDiffWrapper from './ContainerDiffWrapper';
import { useSelector } from '../hooks/useSelector';
import { controlUpdate, HookState, stateSelector } from '../common/handleFuns';
import { getDragSourceVDom } from '../utils';

function StateDomainWrapper(props: any) {
  const { specialProps, ...rest } = props;
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    stateSelector,
    (prevState, nextState) =>
      controlUpdate(prevState, nextState, specialProps.key),
  );
  const { state, api, componentName } =
    pageConfig[specialProps.key] || getDragSourceVDom()[specialProps.key];
  const isContainerNode = useMemo(() => isContainer(componentName), []);
  const brickdStore = useRedux(state);
  const childProps = useGetProps(brickdStore.getPageState(),rest);
  useService(brickdStore.getPageState(), api);
  return (
    <PropsProvider value={childProps}>
      <BrickStoreProvider value={brickdStore}>
        <ContainerDiffWrapper
          isContainer={isContainerNode}
          specialProps={specialProps}
          {...rest}
        />
      </BrickStoreProvider>
    </PropsProvider>
  );
}

export default memo(StateDomainWrapper);
