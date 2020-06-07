import { createContext } from 'react';
import { Store } from 'redux';

const LegoContext = createContext<Store|null>(null)
export default LegoContext
