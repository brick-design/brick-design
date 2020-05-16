import {createElement, useContext} from "react";
import LegoContext from "./LegoContext";
import {LEGO_BRIDGE,createLegStore} from "../store";
import {flattenDeepArray} from "../utils";

export  function LegoProvider({children,initState,config}:any) {
    if(!LEGO_BRIDGE.config) {
        LEGO_BRIDGE.config=config
        LEGO_BRIDGE.containers=flattenDeepArray(config.CONTAINER_CATEGORY)
    }
    return createElement(LegoContext.Provider,{value:createLegStore(initState)},children)
}
