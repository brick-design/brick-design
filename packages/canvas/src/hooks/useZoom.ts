import {  useContext } from 'react';
import { BrickStore } from '@brickd/hooks';
import { ZoomContext, ZoomStateType } from '../components/ZoomProvider';

export function useZoom() {
	const zoomStore =
		useContext<BrickStore<ZoomStateType>>(ZoomContext);

	return {
		setZoomState:zoomStore.setPageState,
		getZoomState: zoomStore.getPageState,
		setSubscribe: zoomStore.subscribe,
	};
}
