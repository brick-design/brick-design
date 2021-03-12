import { isEmpty } from 'lodash';
import { produce } from 'immer';
import { PlainObjectType, StateType } from '../types';
import { warn } from '../utils';
import { ApiPayload } from '../actions';

export function setComponentState(
  state: StateType,
  payload: PlainObjectType,
): StateType {
  const { selectedInfo, pageConfig, undo, redo } = state;
  if (!selectedInfo) {
    warn('Please select the components');
    return state;
  }
  const { selectedKey } = selectedInfo;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[selectedKey];
      if (isEmpty(payload) && config.state) {
        delete config.state;
      } else {
        config.state = payload;
      }
    }),
    undo,
    redo,
  };
}

export function setApi(state: StateType, payload: ApiPayload): StateType {
  const { selectedInfo, pageConfig, undo, redo } = state;
  if (!selectedInfo) {
    warn('Please select the components');
    return state;
  }
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[selectedInfo.selectedKey];
      if (isEmpty(payload.api) && config.api) {
        delete config.api;
      } else {
        config.api = payload.api;
      }
    }),
    undo,
    redo,
  };
}
