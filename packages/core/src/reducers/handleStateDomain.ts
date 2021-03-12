import { produce } from 'immer';
import { StateType } from '../types';
import { ComponentKeyPayload } from '../actions';

export function setStateDomain(
  state: StateType,
  payload: ComponentKeyPayload,
): StateType {
  const { key } = payload;
  const { pageConfig, undo, redo } = state;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[key];
      config.isStateDomain = true;
    }),
    redo,
    undo,
  };
}

export function restStateDomain(
  state: StateType,
  payload: ComponentKeyPayload,
): StateType {
  const { key } = payload;
  const { pageConfig, undo, redo } = state;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[key];
      delete config.isStateDomain;
    }),
    redo,
    undo,
  };
}
