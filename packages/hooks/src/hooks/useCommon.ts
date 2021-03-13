import { useMemo } from 'react';
import { ALL_PROPS, getStateFields, VirtualDOMType } from '@brickd/utils';
import { useGetState } from './useGetState';
import { useService } from './useService';
import { useComponentProps } from './useComponentProps';
import { useHiddenComponent } from './useHiddenComponent';

export function useCommon(vNode: VirtualDOMType, rest: any) {
  const { props: prevProps, state, api, condition, isStateDomain } = vNode;
  const selector = useMemo(
    () => getStateFields({ prevProps, api, condition }),
    [prevProps, api, condition],
  );

  // eslint-disable-next-line no-undef
  const pageState = useGetState(
    isStateDomain ? state : {},
    isStateDomain ? [ALL_PROPS] : selector,
  );
  useService(pageState, api);
  const props = useComponentProps(prevProps, pageState, rest);
  const hidden = useHiddenComponent(pageState, condition);
  return { props, hidden, pageState };
}
