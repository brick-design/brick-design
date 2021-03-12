import React, { memo } from 'react';

import {
  useService,
  useRedux,
  PropsProvider,
  BrickStoreProvider,
  useGetProps,
} from '@brickd/hooks';
import { STATE_PROPS, isContainer } from '@brickd/core';
import Container from './Container';
import NoneContainer from './NoneContainer';
import { useSelector } from '../hooks/useSelector';
import { controlUpdate, HookState, stateSelector } from '../common/handleFuns';

function StateDomainWarpper(props: any) {
  const { onMouseLeave, specialProps, isDragAddChild, ...rest } = props;
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    stateSelector,
    (prevState, nextState) =>
      controlUpdate(prevState, nextState, specialProps.key),
  );
  const { state, api, propFields, componentName } = pageConfig[
    specialProps.key
  ];
  const brickdStore = useRedux(state);
  const childProps =
    useGetProps(propFields, brickdStore.getPageState()) || rest;
  useService(brickdStore.getPageState(), api);
  return (
    <PropsProvider value={childProps}>
      <BrickStoreProvider value={brickdStore}>
        {isContainer(componentName) ? (
          <Container
            onMouseLeave={onMouseLeave}
            isDragAddChild={isDragAddChild}
            specialProps={specialProps}
          />
        ) : (
          <NoneContainer
            onMouseLeave={onMouseLeave}
            isDragAddChild={isDragAddChild}
            specialProps={specialProps}
          />
        )}
      </BrickStoreProvider>
    </PropsProvider>
  );
}

export default memo(StateDomainWarpper);
