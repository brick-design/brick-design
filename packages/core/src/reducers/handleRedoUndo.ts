import { each, get } from 'lodash';
import { StateType } from '../types';

/**
 * 撤销
 * @param state
 * @returns {(*&void&{undo: *, redo: *})|(*&T&{undo: *, redo: *})}
 */
export function undo(state: StateType) {
  const { undo, redo } = state;
  if (undo.length == 0) return state;
  const nextState = undo.pop();
  const prevState: any = {};
  each(nextState, (_, key) => (prevState[key] = get(state, key)));
  redo.push(prevState);
  return {
    ...state,
    ...nextState,
    undo,
    redo,
  };
}

/**
 * 重做
 * @param state
 * @returns {(*&void&{undo: *, redo: *})|(*&T&{undo: *, redo: *})}
 */
export function redo(state: StateType) {
  const { undo, redo } = state;
  if (redo.length == 0) return state;
  const nextState = redo.pop();
  const prevState: any = {};
  each(nextState, (_, key) => (prevState[key] = get(state, key)));
  undo.push(prevState);
  return {
    ...state,
    ...nextState,
    undo,
    redo,
  };
}
