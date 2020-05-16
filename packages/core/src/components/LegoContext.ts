import {createContext} from "react";

const LegoContext = createContext(null)

if (process.env.NODE_ENV !== 'production') {
    LegoContext.displayName = 'LegoContext'
}

export default LegoContext
