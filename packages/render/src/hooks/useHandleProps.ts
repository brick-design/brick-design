import { useMemo } from 'react';

export function useHandleProps(props: any, ref: any, nodeProps?: any) {
  return useMemo(() => {
    if (props.animateClass) {
      props.className += ' ' + props.animateClass;
    }
    return { ...props, ...nodeProps, ref };
  }, [props, ref, nodeProps]);
}
