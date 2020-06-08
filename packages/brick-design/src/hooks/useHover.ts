import { useSelector } from 'brickd-core';

type HoverType={
hover:string|null
}

function controlUpdate(prevState: HoverType, nextState: HoverType, key: string) {
  const {hover:prevHover}=prevState
  const {hover}=nextState
  if(!prevHover&&hover){
    return hover.includes(key)
  }
  if(prevHover&&!hover){
    return prevHover.includes(key)
  }
  if(prevHover&&hover&&prevHover!==hover){
      return prevHover.includes(key)||!prevHover.includes(key)&&hover.includes(key)
  }
  return false
}
export function useHover(key:string) {
  const {hover}=useSelector<HoverType>(['hover'],
    (prevState,nextState)=>controlUpdate(prevState,nextState,key))
  return !!hover&&hover.includes(key)
}
