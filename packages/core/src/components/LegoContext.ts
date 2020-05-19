import { createContext } from 'react';
import { Store } from 'redux';

const LegoContext = createContext<Store|null>(null)

if (process.env.NODE_ENV !== 'production') {
    LegoContext.displayName = 'LegoContext'
}

export default LegoContext
