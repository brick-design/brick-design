import React, { memo, useContext } from 'react';

import {
  useService,
  useRedux,
  PropsProvider,
  BrickStoreProvider,
  useGetProps,
  StaticContext,
} from '@brickd/hooks';
import Container from './Container';
import NoneContainer from './NoneContainer';

function StateDomainWrapper(props: any) {
  const { renderKey, ...rest } = props;
  const { pageConfig } = useContext(StaticContext);

  const { state, api, childNodes } = pageConfig[renderKey];
  const brickdStore = useRedux(state);
  const childProps =
    useGetProps(brickdStore.getPageState(),rest);
  useService(brickdStore.getPageState(), api);
  return (
    <PropsProvider value={childProps}>
      <BrickStoreProvider value={brickdStore}>
        {childNodes ? (
          <Container renderKey={renderKey} />
        ) : (
          <NoneContainer renderKey={renderKey} />
        )}
      </BrickStoreProvider>
    </PropsProvider>
  );
}

export default memo(StateDomainWrapper);
