import { useBrickSelector, ControlUpdate } from '@brickd/hooks';
import { BrickContext } from '../components/BrickProvider';

export function useSelector<T, U extends string>(
  selector: U[],
  controlUpdate?: ControlUpdate<T>,
  stateDeep?: string,
) {
  return useBrickSelector(selector, controlUpdate, stateDeep, BrickContext);
}
