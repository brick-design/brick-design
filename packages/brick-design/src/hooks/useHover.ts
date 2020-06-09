import { STATE_PROPS, useSelector } from 'brickd-core';

type HoverType = {
  hoverKey: string | null
}

function controlUpdate(prevState: HoverType, nextState: HoverType, key: string) {
  const { hoverKey: prevHoverKey } = prevState;
  const { hoverKey } = nextState;
  if (!prevHoverKey && hoverKey) {
    return hoverKey.includes(key);
  }
  if (prevHoverKey && !hoverKey) {
    return prevHoverKey.includes(key);
  }
  if (prevHoverKey && hoverKey && prevHoverKey !== hoverKey) {
    return prevHoverKey.includes(key) || !prevHoverKey.includes(key) && hoverKey.includes(key);
  }
  return false;
}

export function useHover(key: string) {
  const { hoverKey } = useSelector<HoverType, STATE_PROPS>(['hoverKey'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  return !!hoverKey && hoverKey.includes(key);
}
