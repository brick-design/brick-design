import { useMemo } from 'react';
import { dataMapping } from '@brickd/utils';

export function useComponentProps(prevProps: any, pageState: any, rest?: any) {
  return useMemo(() => {
    const props = dataMapping(prevProps, pageState);
    return rest ? { ...props, ...rest } : props;
  }, [prevProps, pageState, rest]);
}
