import { useContext, useMemo } from 'react';
import { useBrickdState } from './useBrickdState';
import { useBrickSelector } from './useBrickSelector';
import { FunParamContext } from '../components/FunParamContext';
import { PropsContext } from '../components/PropsContext';
import { MapNodeContext } from '../components/MapNodeContext';

export function useGetState(propsState: any, selector: string[]) {
  const { state } = useBrickdState(propsState);
  const brickdState = useBrickSelector<any, string>(selector);

  const props = useContext(PropsContext);
  const funParams = useContext(FunParamContext);
  const mapItem = useContext(MapNodeContext) || {};

  return useMemo(() => {
    let index = mapItem.index;
    if (funParams) {
      for (const param of funParams) {
        if (typeof param === 'number' || !isNaN(parseInt(param))) {
          index = param;
          break;
        }
      }
    }

    return new Proxy(
      { ...brickdState, ...state, funParams, props, ...mapItem, index },
      {
        get: function (target, propKey, receiver) {
          return Reflect.get(target, propKey, receiver);
        },
        set: function (target, propKey, value, receiver) {
          if (propKey in brickdState) {
            brickdState.setPageState({ [propKey]: value });
          } else {
            state.setState({ [propKey]: value });
          }
          return Reflect.set(target, propKey, value, receiver);
        },
      },
    );
  }, [state, brickdState, funParams, props, mapItem]);
}
