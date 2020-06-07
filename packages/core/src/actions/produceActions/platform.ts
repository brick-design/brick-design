import ACTION_TYPES from '../actionTypes';
import { PlatformInfoType } from '../../types';
import { LEGO_BRIDGE } from '../../store';

export const changePlatform=(payload:PlatformInfoType)=>LEGO_BRIDGE.store!.dispatch({type:ACTION_TYPES.changePlatform,payload})
