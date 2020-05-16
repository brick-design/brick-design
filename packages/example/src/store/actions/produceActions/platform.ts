import ACTION_TYPES from "../actionTypes";
import {PlatformInfoType} from "../../interfaces";
import {LEGO_BRIDGE} from "../../store";

export const changePlatform=(payload:PlatformInfoType)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.changePlatform,payload})
