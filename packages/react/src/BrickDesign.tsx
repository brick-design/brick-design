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
	ComponentConfigsType,
	DragSourceType,
	isContainer,
	ROOT,
	STATE_PROPS,
} from '@brickd/core';
import ReactDOM from 'react-dom';
import { LegoProvider, useSelector } from '@brickd/redux-bridge';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { getIframe, iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';
import Guidelines from './components/Guidelines';
import Distances from './components/Distances';
import Resize from './components/Resize';

const onIframeLoad = (
	divContainer: any,
	designPage: any,
	iframe: HTMLIFrameElement,
) => {
	const head = document.head.cloneNode(true);
	const contentDocument = iframe.contentDocument!;
	contentDocument.head.remove();
	contentDocument.documentElement.insertBefore(head, contentDocument.body);
	divContainer.current = contentDocument.getElementById('dnd-container');
	componentMount(designPage, divContainer);
};

const componentMount = (designPage: any, divContainer: any) => {
	ReactDOM.render(
  <LegoProvider>
    {designPage}
    <Guidelines />
    <Distances />
    <Resize />
  </LegoProvider>,
		divContainer.current,
	);
};
const onDragEnter = (dragSource: DragSourceType, divContainer: any) => {
	const { vDOMCollection } = dragSource;
	componentMount(renderComponent(vDOMCollection!), divContainer);
};
const onDragLeave = (divContainer: any) => {
	ReactDOM.unmountComponentAtNode(divContainer.current);
};

const renderComponent = (componentConfigs: ComponentConfigsType) => {
	const {
		[ROOT]: { componentName },
	} = componentConfigs;
	const props = {
		specialProps: {
			domTreeKeys: [ROOT],
			key: ROOT,
			parentKey: '',
		},
	};
	return isContainer(componentName) ? (
  <Container onMouseLeave={clearHovered} {...props} />
	) : (
  <NoneContainer onMouseLeave={clearHovered} {...props} />
	);
};

/**
 * 鼠标离开设计区域清除hover状态
 */
interface BrickDesignProps extends IframeHTMLAttributes<any> {
	onLoadEnd?: () => void
}

const stateSelector: STATE_PROPS[] = ['componentConfigs', 'dragSource'];

type BrickdHookState = {
	componentConfigs: ComponentConfigsType
	dragSource: DragSourceType
}

const controlUpdate = (
	prevState: BrickdHookState,
	nextState: BrickdHookState,
) => {
	const { componentConfigs: prevComponentConfigs } = prevState;
	const { componentConfigs } = nextState;

	return (
		!componentConfigs[ROOT] ||
		componentConfigs[ROOT] !== prevComponentConfigs[ROOT]
	);
};

function BrickDesign(props: BrickDesignProps) {
	const { componentConfigs, dragSource } = useSelector<
		BrickdHookState,
		STATE_PROPS
	>(stateSelector, controlUpdate);
	const iframeRef = useRef<HTMLIFrameElement>();
	const designPage: any = useMemo(() => {
		if (!componentConfigs[ROOT]) return null;
		return renderComponent(componentConfigs);
	}, [componentConfigs]);

	const divContainer = useRef(null);

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
		if (componentConfigs[ROOT]) return;
		const contentWindow = getIframe()!.contentWindow!;
		const dragEnter = () => onDragEnter(dragSource, divContainer);
		const dragLeave = () => onDragLeave(divContainer);
		contentWindow.addEventListener('dragenter', dragEnter);
		contentWindow.addEventListener('dragleave', dragLeave);
		return () => {
			contentWindow.removeEventListener('dragenter', dragEnter);
			contentWindow.removeEventListener('dragleave', dragLeave);
		};
	}, [componentConfigs, dragSource, divContainer, iframeRef]);

	useEffect(() => {
		if (divContainer.current) {
			componentMount(designPage, divContainer);
		}
	}, [divContainer.current, designPage]);

	const { onLoadEnd } = props;
	return (
  <iframe
    id="dnd-iframe"
    style={{ border: 0, width: '100%', height: '100%' }}
    srcDoc={iframeSrcDoc}
    onLoad={useCallback(() => {
				onIframeLoad(divContainer, designPage, iframeRef.current!);
				onLoadEnd && onLoadEnd();
			}, [iframeRef.current])}
    {...props}
		/>
	);
}

export default memo(BrickDesign);
