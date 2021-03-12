import { useContext, useMemo } from 'react';
import { each } from 'lodash';
import { PropsContext } from '../components/PropsContext';

export function useGetProps(propFields: string[], state: any) {
  const parentProps = useContext(PropsContext);
  return useMemo(() => {
    const props = {};
    each(propFields, (field) => (props[field] = parentProps[field]));
    return { ...state, ...props };
  }, [parentProps]);
}
