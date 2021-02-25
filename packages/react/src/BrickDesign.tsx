import React, {
	IframeHTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import {
	clearHovered,
	PageConfigType,
	DragSourceType,
	STATE_PROPS,
	PageStateConfigType,
	getStore,
	StateType,
	initPageBrickdState,
	setPageName,
	 ROOT, isContainer,
} from '@brickd/core';
import ReactDOM from 'react-dom';
import {
	useService,
	useRedux,
	FunParamContextProvider,
	StaticContextProvider,
	BrickStoreProvider,
} from '@brickd/hooks';
import { BrickContext } from 'components/BrickProvider';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { getIframe, iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';
import Guidelines from './components/Guidelines';
import Distances from './components/Distances';
import Resize from './components/Resize';
import {useSelector} from './hooks/useSelector';

/**
 * 鼠标离开设计区域清除hover状态
 */
interface BrickDesignProps extends IframeHTMLAttributes<any> {
	onLoadEnd?: () => void
	initState?:Partial<StateType>
	pageName:string,
	[propName:string]:any
}

const stateSelector: STATE_PROPS[] = ['pageConfig', 'dragSource','pageStateConfig'];

type BrickdHookState = {
	pageConfig: PageConfigType
	dragSource: DragSourceType
	pageStateConfig:PageStateConfigType
}

const controlUpdate = (
	prevState: BrickdHookState,
	nextState: BrickdHookState,
) => {
	const { pageConfig: prevPageConfig,pageStateConfig:prevPageStateConfig } = prevState;
	const { pageConfig,pageStateConfig } = nextState;
	const nextRootComponent=pageConfig[ROOT];
	const prevRootComponent=prevPageConfig[ROOT];
	return (
		!nextRootComponent ||
		nextRootComponent !== prevRootComponent
		||prevPageStateConfig!==pageStateConfig
	);
};

function BrickDesign(brickdProps: BrickDesignProps) {
	const { onLoadEnd,pageName,initState,options,...props } = brickdProps;
	const { pageConfig={}, dragSource={},pageStateConfig={}} = useSelector<
		BrickdHookState, STATE_PROPS>(stateSelector, controlUpdate);
	const iframeRef = useRef<HTMLIFrameElement>();
	const rootComponent=pageConfig[ROOT];
	const {state,api}=pageStateConfig;
	const brickdStore= useRedux(state);
	const staticState=useMemo(()=>({pageConfig,props,options}),[pageConfig,props,options]);

	const renderComponent = useCallback((pageConfig: PageConfigType) => {
		const rootComponent=pageConfig[ROOT];
		if (!rootComponent) return null;
		const specialProps={domTreeKeys:[ROOT],key:ROOT,parentKey:''};
		return isContainer(rootComponent.componentName) ? (
			<Container onMouseLeave={clearHovered} specialProps={specialProps}/>
		) : (
			<NoneContainer onMouseLeave={clearHovered} specialProps={specialProps}/>
		);
	},[]);

	const designPage= useMemo(()=>renderComponent(pageConfig),[pageConfig]);
	const divContainer = useRef(null);
	const componentMount = useCallback((divContainer,designPage) => {
		ReactDOM.render(
			<BrickStoreProvider value={brickdStore}>
				<FunParamContextProvider value={undefined}>
					<StaticContextProvider value={staticState}>
						<BrickContext.Provider value={getStore()}>
							{designPage}
							<Guidelines />
							<Distances />
							<Resize />
						</BrickContext.Provider>
					</StaticContextProvider>
				</FunParamContextProvider>
			</BrickStoreProvider>,
			divContainer.current,
		);
	},[brickdStore,staticState]);

	const onDragEnter = useCallback(() => {
		const { vDOMCollection } = dragSource;
		componentMount(divContainer,renderComponent(vDOMCollection!));
	},[dragSource,componentMount,divContainer]);

	const onDragLeave = useCallback(() => {
		ReactDOM.unmountComponentAtNode(divContainer.current);
	},[divContainer.current]);
	useService(brickdStore.getPageState(),api);

	const onIframeLoad = useCallback(() => {
		const head = document.head.cloneNode(true);
		const contentDocument = iframeRef.current.contentDocument!;
		contentDocument.head.remove();
		contentDocument.documentElement.insertBefore(head, contentDocument.body);
		divContainer.current = contentDocument.getElementById('dnd-container');
		componentMount(divContainer,designPage);
		onLoadEnd && onLoadEnd();
	},[divContainer.current,iframeRef.current,designPage,onLoadEnd,componentMount]);

	useEffect(()=>{
		setPageName(pageName);
		initPageBrickdState(initState);
	},[pageName]);

	useEffect(() => {
		iframeRef.current = getIframe();
		const contentWindow = iframeRef.current.contentWindow!;
		contentWindow.addEventListener('dragover', onDragover);
		contentWindow.addEventListener('drop', onDrop);
		return () => {
			contentWindow.removeEventListener('dragover', onDragover);
			contentWindow.removeEventListener('drop', onDrop);
		};
	}, []);

	useEffect(() => {
		if (rootComponent) return;
		const contentWindow = getIframe()!.contentWindow!;

		contentWindow.addEventListener('dragenter', onDragEnter);
		contentWindow.addEventListener('dragleave', onDragLeave);
		return () => {
			contentWindow.removeEventListener('dragenter', onDragEnter);
			contentWindow.removeEventListener('dragleave', onDragLeave);
		};
	}, [rootComponent,onDragEnter,onDragLeave]);

	useEffect(() => {
		if (divContainer.current) {
			componentMount(divContainer,designPage);
		}
	}, [divContainer.current,componentMount,designPage]);

	return (
  <iframe
    id="dnd-iframe"
    style={{ border: 0, width: '100%', height: '100%' }}
    srcDoc={iframeSrcDoc}
    onLoad={onIframeLoad}
    {...props}
		/>
	);
}

export default memo(BrickDesign);
