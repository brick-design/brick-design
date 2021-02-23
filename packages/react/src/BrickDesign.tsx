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
import { LegoProvider, useSelector } from '@brickd/redux-bridge';
import {
	useService,
	FunParamContextProvider,
	useBrickdState,
	StaticContextProvider,
	BrickdContextProvider,
} from '@brickd/hooks';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { getIframe, iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';
import Guidelines from './components/Guidelines';
import Distances from './components/Distances';
import Resize from './components/Resize';

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
	const {state:brickdState}= useBrickdState(state,true);
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
			<BrickdContextProvider value={brickdState}>
				<FunParamContextProvider value={undefined}>
					<StaticContextProvider value={staticState}>
						<LegoProvider value={getStore()}>
							{designPage}
							<Guidelines />
							<Distances />
							<Resize />
						</LegoProvider>
					</StaticContextProvider>
				</FunParamContextProvider>
			</BrickdContextProvider>,
			divContainer.current,
		);
	},[brickdState,staticState]);

	const onDragEnter = useCallback(() => {
		const { vDOMCollection } = dragSource;
		componentMount(divContainer,renderComponent(vDOMCollection!));
	},[dragSource,componentMount,divContainer]);

	const onDragLeave = useCallback(() => {
		ReactDOM.unmountComponentAtNode(divContainer.current);
	},[divContainer.current]);

	useService(brickdState,api);

	const onIframeLoad = useCallback(() => {
		const head = document.head.cloneNode(true);
		const contentDocument = iframeRef.current.contentDocument!;
		contentDocument.head.remove();
		contentDocument.documentElement.insertBefore(head, contentDocument.body);
		divContainer.current = contentDocument.getElementById('dnd-container');
		componentMount(divContainer,designPage);
		onLoadEnd && onLoadEnd();
	},[divContainer.current,iframeRef.current,designPage,onLoadEnd]);

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
