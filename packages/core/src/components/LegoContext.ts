import { createContext } from 'react';
import { Store } from 'redux';

export const LegoContext = createContext<Store|null>(null)
