import { STATE_PROPS, useSelector } from 'brickd-core';
import { formatUnit, isEqualKey } from '../utils';

type HoverType = {
  hoverKey: string | null
}

function controlUpdate(prevState: HoverType, nextState: HoverType, key: string) {
  const { hoverKey: prevHoverKey } = prevState;
  const { hoverKey } = nextState;
  if (!prevHoverKey && hoverKey) {
    return isEqualKey(key,hoverKey);
  }
  if (prevHoverKey && !hoverKey) {
    return isEqualKey(key,prevHoverKey);
  }
  if (prevHoverKey && hoverKey && prevHoverKey !== hoverKey) {
    return isEqualKey(key,prevHoverKey) || !isEqualKey(key,prevHoverKey) && isEqualKey(key,hoverKey);
  }
  return false;
}

export function useHover(key: string) {
  const { hoverKey } = useSelector<HoverType, STATE_PROPS>(['hoverKey'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  return isEqualKey(key,hoverKey);
}
