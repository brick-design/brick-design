import produce from 'immer';
import { update,merge,get } from 'lodash';
import { StateType } from '../types';
import { VisualizedStylesPayload, stylePayload } from '../actions';

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
  const { undo, redo, selectedInfo,styleSheet,pageConfig} = state;
  if (!selectedInfo) return state;
  const { style } = payload;
  const {selectedKey,selectedStyleProp}=selectedInfo;
  if(!selectedStyleProp){
    undo.push({ pageConfig });
    redo.length = 0;
    return {
      ...state,
      pageConfig: produce(pageConfig, (oldConfigs) => {
        const config = oldConfigs[selectedKey];
        if (get(config.props,'style')) {
          config.props.style = { ...config.props.style, ...style };
        } else {
          config.props = { style };
        }
      }),
      undo,
      redo,
    };
  }
  undo.push({ styleSheet });
  redo.length = 0;
  return {
    ...state,
    styleSheet:produce(styleSheet||{},(oldStyleSheet)=>{
      oldStyleSheet[selectedKey+selectedStyleProp]=style;
    }),
    undo,
    redo,
  };
}

export function changeVisualizedStyles(state: StateType, payload: VisualizedStylesPayload) {
  const {undo, redo, selectedInfo,styleSheet,pageConfig } = state;
  if (!selectedInfo) return state;
  const { selectedKey,selectedStyleProp, } = selectedInfo;
  const { width, height } = payload;

  if(!selectedStyleProp){
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
  if (width || height) {
    undo.push({ styleSheet });
    redo.length = 0;
  }

  return {
    ...state,
    styleSheet:produce(styleSheet||{},(oldStyleSheet)=>{
    update(oldStyleSheet,[selectedKey+selectedStyleProp],(value)=>merge(value,payload));
  }),
  undo,
    redo,
  };
}
