import { get } from 'lodash';
import produce from 'immer';

import { StateType } from '../types';

import { ChangePropsPayload } from '../actions';

/**
 * 提交属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}}
 */
export function changeProps(
  state: StateType,
  payload: ChangePropsPayload,
): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state;
  if (!selectedInfo) return state;
  const { props } = payload;
  const { selectedKey } = selectedInfo;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig!, (oldConfigs) => {
      const style = get(oldConfigs, [selectedKey, 'props', 'style']);
      if (style) {
        oldConfigs[selectedKey].props = { ...props, style };
      } else {
        oldConfigs[selectedKey].props = props;
      }
    }),
    undo,
    redo,
  };
}

/**
 * 重置属性
 * @param state
 */
export function resetProps(state: StateType): StateType {
  const { selectedInfo, pageConfig, undo, redo } = state;
  if (!selectedInfo) return state;
  const { selectedKey, props } = selectedInfo;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const style = get(oldConfigs, [selectedKey, 'props', 'style']);
      if (style) {
        oldConfigs[selectedKey].props = { ...props, style };
      } else {
        oldConfigs[selectedKey].props = props;
      }
    }),
    undo,
    redo,
  };
}
