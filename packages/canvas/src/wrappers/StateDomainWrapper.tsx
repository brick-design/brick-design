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
import { controlUpdate, HookState } from '../common/handleFuns';
import { getDragSourceFromKey } from '../utils';

function StateDomainWrapper(props: any) {
  const { specialProps, ...rest } = props;
  const { pageConfig } = useSelector<HookState, STATE_PROPS>(
    ['pageConfig'],
    (prevState, nextState) =>
      controlUpdate(prevState, nextState, specialProps.key),
  );
  const vNode =
    pageConfig[specialProps.key] ||
    getDragSourceFromKey('template', {})[specialProps.key];
  const { state, api, componentName } = vNode || {};
  const brickdStore = useRedux(state);
  const childProps = useGetProps(brickdStore.getPageState(), rest);
  useService(brickdStore.getPageState(), api);
  const isContainerNode = useMemo(() => isContainer(componentName), []);

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
