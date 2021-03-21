import { useContext, useMemo } from 'react';
import { PropsContext } from '../components/PropsContext';

export function useGetProps(state: any,props:any) {
  const parentProps = useContext(PropsContext);
  return useMemo(() => {
    return { ...state, ...props,...parentProps };
  }, [parentProps,state,props]);
}
