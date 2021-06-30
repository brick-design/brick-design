import produce from 'immer';
import { update,merge } from 'lodash';
import { StateType } from '../types';
import { ResizePayload, stylePayload } from '../actions';

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
  const { undo, redo, selectedInfo,styleSheet } = state;
  if (!selectedInfo) return state;
  const { style } = payload;
  const {selectedKey,selectedStyleProp}=selectedInfo;
  undo.push({ styleSheet });
  redo.length = 0;
  return {
    ...state,
    styleSheet:produce(styleSheet,(oldStyleSheet)=>{
      update(oldStyleSheet,[selectedKey,selectedStyleProp,'value'],()=>style);
    }),
    undo,
    redo,
  };
}

export function resizeChange(state: StateType, payload: ResizePayload) {
  const {undo, redo, selectedInfo,styleSheet } = state;
  if (!selectedInfo) return state;
  const { selectedKey,selectedStyleProp } = selectedInfo;
  const { width, height } = payload;
  if (width || height) {
    undo.push({ styleSheet });
    redo.length = 0;
  }

  return {
    ...state,
    styleSheet:produce(styleSheet,(oldStyleSheet)=>{
    update(oldStyleSheet,[selectedKey,selectedStyleProp,'value'],(value)=>merge(value,payload));
  }),
  undo,
    redo,
  };
}
