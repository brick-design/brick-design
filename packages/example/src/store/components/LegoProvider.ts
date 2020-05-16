import {createElement, useMemo} from "react";
import createStore from '../store'
import LegoContext from "./LegoContext";
import {Provider} from 'redux-bridge'

export  function LegoProvider({children}:any) {
    return createElement(Provider,{store:createStore(),context:LegoContext},children)
}
