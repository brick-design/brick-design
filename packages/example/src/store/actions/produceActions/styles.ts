import ACTION_TYPES from "../actionTypes";
import {LEGO_BRIDGE} from "../../store";

export const changeStyles=(payload:{style:any})=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.changeStyles,payload})
