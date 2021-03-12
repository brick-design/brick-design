import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';
import { StateType } from '../../types';

export const initPageBrickdState = (payload: Partial<StateType>) =>
  createActions({ type: ACTION_TYPES.initPageBrickdState, payload });

export const removePageBrickdState = () =>
  createActions({
    type: ACTION_TYPES.removePageBrickdState,
  });
