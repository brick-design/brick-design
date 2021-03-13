import React, { memo, forwardRef } from 'react';
import NoneContainer from './NoneContainer';
import Container, { CommonPropsType } from './Container';

export interface ContainerDiff extends CommonPropsType {
  isContainer: boolean;
}
function ContainerDiffWrapper(props: ContainerDiff, ref: any) {
  const { isContainer, ...rest } = props;
  return isContainer ? (
    <Container {...rest} ref={ref} />
  ) : (
    <NoneContainer {...rest} ref={ref} />
  );
}

export default memo(forwardRef(ContainerDiffWrapper));
