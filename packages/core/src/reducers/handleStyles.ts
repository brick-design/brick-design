import { StateType } from '../types';
import produce from 'immer';
import { stylePayload } from '../actions';
import { restObject } from '../utils';

/**
 * 样式改变时调用
 * @param state
 * @param payload
 * @returns {{propsSetting: *, componentConfigs: *}|*}
 */
export function changeStyles(state: StateType, payload: stylePayload): StateType {
  const { undo, redo, selectedInfo, componentConfigs } = state;
  if (!selectedInfo) return state;
  const { style } = payload;
  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfigs => {
      const config = oldConfigs[selectedInfo.selectedKey];
      if (config.props) {
        config.props.style = style;
      } else {
        config.props = { style };
      }
    }),
    undo,
    redo,
  };
}

export function resetStyles(state: StateType): StateType {
  const { selectedInfo, undo, componentConfigs, redo } = state;
  if (!selectedInfo) return state;
  const { props, selectedKey } = selectedInfo;
  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfigs => {
      const config = oldConfigs[selectedKey];
      if (props&&props.style) {
        config.props.style = props.style;
      } else {
        config.props=restObject(config.props,'style')
      }
    }),
    undo,
    redo,
  };
}
