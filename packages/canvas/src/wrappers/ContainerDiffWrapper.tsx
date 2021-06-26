import React, { memo, useMemo } from 'react';
import Container from './Container';
import NoneContainer from './NoneContainer';
import { CommonPropsType } from '../common/handleFuns';

export interface ContainerDiff extends CommonPropsType {
  isContainer: boolean;
}
function ContainerDiffWrapper(props: ContainerDiff) {
  const { isContainer, ...rest } = props;

  return useMemo(
    () => (isContainer ? <Container {...rest} /> : <NoneContainer {...rest} />),
    [],
  );
}

export default memo(ContainerDiffWrapper);
