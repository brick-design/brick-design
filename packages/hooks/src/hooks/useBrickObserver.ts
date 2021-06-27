import { useContext } from 'react';
import { BrickObserverContext } from '../components/BrickObserverContext';
import { BrickObserver } from '../utils/BrickOberver';

export function useBrickObserver(){
	return useContext<BrickObserver>(BrickObserverContext);
}
