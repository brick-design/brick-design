import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { PropsConfigType } from '../../types';

export type AddPropsConfigPayload = {
  newPropField?: string,
  fatherFieldLocation: string,
  childPropsConfig?: PropsConfigType[],
  propType?: string
}
export const addPropsConfig = (payload: AddPropsConfigPayload) => LEGO_BRIDGE.store!.dispatch({
  type: ACTION_TYPES.addPropsConfig,
  payload,
});
export type DeletePropsConfigPayload = {
  fatherFieldLocation: string,
  field: string
}
export const deletePropsConfig = (payload: DeletePropsConfigPayload) => LEGO_BRIDGE.store!.dispatch({
  type: ACTION_TYPES.deletePropsConfig,
  payload,
});
export type ChangePropsPayload = {
  props: any
}
export const changeProps = (payload: ChangePropsPayload) => LEGO_BRIDGE.store!.dispatch({
  type: ACTION_TYPES.changeProps,
  payload,
});

export const resetProps = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.resetProps });
