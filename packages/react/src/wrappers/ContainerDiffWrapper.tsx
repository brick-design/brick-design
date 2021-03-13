import React, { memo, forwardRef, useMemo } from 'react';
import Container from './Container';
import NoneContainer from './NoneContainer';
import { CommonPropsType } from '../common/handleFuns';

export interface ContainerDiff extends CommonPropsType {
  isContainer: boolean;
}
function ContainerDiffWrapper(props: ContainerDiff, ref: any) {
  const { isContainer, ...rest } = props;

  return useMemo(
    () =>
      isContainer ? (
        <Container {...rest} ref={ref} />
      ) : (
        <NoneContainer {...rest} ref={ref} />
      ),
    [],
  );
}

export default memo(forwardRef(ContainerDiffWrapper));
