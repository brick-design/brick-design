import produce from 'immer';
import { update } from 'lodash';
import { StateType } from '../types';
import { ResizePayload, stylePayload } from '../actions';
import { restObject } from '../utils';

/**
 * 样式改变时调用
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}|*}
 */
export function changeStyles(
  state: StateType,
  payload: stylePayload,
): StateType {
  const { undo, redo, selectedInfo, pageConfig } = state;
  if (!selectedInfo) return state;
  const { style } = payload;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[selectedInfo.selectedKey];
      if (config.props) {
        config.props.style = {...config.props.style,...style};
      } else {
        config.props = { style };
      }
    }),
    undo,
    redo,
  };
}

export function resetStyles(state: StateType): StateType {
  const { selectedInfo, undo, pageConfig, redo } = state;
  if (!selectedInfo) return state;
  const { props, selectedKey } = selectedInfo;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[selectedKey];
      if (props && props.style) {
        config.props.style = props.style;
      } else {
        config.props = restObject(config.props, 'style');
      }
    }),
    undo,
    redo,
  };
}

export function resizeChange(state: StateType, payload: ResizePayload) {
  const { pageConfig, undo, redo, selectedInfo } = state;
  if (!selectedInfo) return state;
  const { selectedKey } = selectedInfo;
  const { width, height } = payload;
  if (width || height) {
    undo.push({ pageConfig });
    redo.length = 0;
  }

  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      if (width) {
        update(oldConfigs[selectedKey], 'props.style.width', () => width);
      }
      if (height) {
        update(oldConfigs[selectedKey], 'props.style.height', () => height);
      }
    }),
  };
}
