import { useMemo } from 'react';
import { evalExpression, tokenize } from '@brickd/utils';

export function useHiddenComponent(pageState: any, isHidden?: string) {
  return useMemo(
    () =>
      isHidden && isHidden.includes('$')
        ? tokenize(isHidden, pageState)
        : evalExpression(isHidden, pageState),
    [pageState, isHidden],
  );
}
