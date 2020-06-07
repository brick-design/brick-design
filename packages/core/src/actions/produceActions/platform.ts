import ACTION_TYPES from '../actionTypes';
import { PlatformInfoType } from '../../types';
import { LEGO_BRIDGE } from '../../store';
const {dispatch}=LEGO_BRIDGE.store!

export const changePlatform=(payload:PlatformInfoType)=>dispatch({type:ACTION_TYPES.changePlatform,payload})
