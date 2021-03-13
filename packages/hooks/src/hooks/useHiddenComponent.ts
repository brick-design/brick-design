import { useMemo } from 'react';
import { evalExpression, tokenize } from '@brickd/utils';

export function useHiddenComponent(pageState: any, condition?: string) {
  return useMemo(
    () =>
      condition && condition.includes('$')
        ? tokenize(condition, pageState)
        : evalExpression(condition, pageState),
    [pageState, condition],
  );
}
