import React, { IframeHTMLAttributes, useCallback, useEffect, useMemo, useRef } from 'react';
import { clearHovered, LEGO_BRIDGE, LegoProvider, useSelector } from 'brickd-core';
import ReactDOM from 'react-dom';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';

export * from './common/events'


const onIframeLoad = (divContainer:any,designPage:any) => {
    const head = document.head.cloneNode(true)
    const iframe: any = document.getElementById('dnd-iframe');
    const iframeDocument = iframe.contentDocument
    iframeDocument.head.remove()
    iframeDocument.documentElement.insertBefore(head, iframeDocument.body)
    divContainer.current = iframe.contentDocument.getElementById('dnd-container');
    ReactDOM.render(
      <LegoProvider>
          {designPage}
      </LegoProvider>, divContainer.current);
}

/**
 * 鼠标离开设计区域清除hover状态
 */
interface BrickDesignProps extends IframeHTMLAttributes<any>{
    onLoadEnd?: () => void,
}

const stateSelector = ['componentConfigs', 'platformInfo']

export function BrickDesign(props: BrickDesignProps) {
    const {componentConfigs, platformInfo} = useSelector(stateSelector);
    let designPage: any = useMemo(() => {
        if (!componentConfigs.root) return null
        const {root: {componentName}} = componentConfigs;
        const props = {
            specialProps: {
                domTreeKeys: ['root'],
                key: "root",
                parentKey:''
            }
        }
        return LEGO_BRIDGE.containers!.includes(componentName) ? <Container {...props} /> : <NoneContainer {...props}/>
    }, [componentConfigs]);

    const divContainer = useRef(null);

    useEffect(() => {
        const iframe: any = document.getElementById('dnd-iframe');
        iframe.contentWindow.addEventListener('dragover', onDragover);
        iframe.contentWindow.addEventListener('drop', onDrop);
        return () => {
            iframe.contentWindow.removeEventListener('dragover', onDragover);
            iframe.contentWindow.removeEventListener('drop', onDrop);
        };

    }, [divContainer.current]);

    useEffect(() => {
        if (divContainer.current)
            ReactDOM.render(
                <LegoProvider>
                    {designPage}
                </LegoProvider>, divContainer.current);
    }, [divContainer.current, designPage]);


    const {size} = platformInfo;

    const style = {width: size[0], maxHeight: size[1], transition: 'all 700ms'};

    const {onLoadEnd} = props
    return (<iframe onMouseLeave={clearHovered}
                    id="dnd-iframe"
                    style={{border: 0, ...style}}
                    srcDoc={iframeSrcDoc}
                    onLoad={useCallback(() => {
                        onIframeLoad(divContainer,designPage)
                        onLoadEnd && onLoadEnd()
                    }, [])}
                    {...props}
            />
    );
}

