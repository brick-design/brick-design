import React, { IframeHTMLAttributes, useCallback, useEffect, useMemo, useRef } from 'react';
import { clearHovered, isContainer, LegoProvider, ROOT, useSelector } from 'brickd-core';
import ReactDOM from 'react-dom';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';
import { iframeSrcDoc } from './utils';
import { onDragover, onDrop } from './common/events';

export * from './common/events';

const onIframeLoad = (divContainer: any, designPage: any) => {
  const head = document.head.cloneNode(true);
  const iframe: any = document.getElementById('dnd-iframe');
  const iframeDocument = iframe.contentDocument;
  iframeDocument.head.remove();
  iframeDocument.documentElement.insertBefore(head, iframeDocument.body);
  divContainer.current = iframe.contentDocument.getElementById('dnd-container');
  ReactDOM.render(<>
    <LegoProvider>
      {designPage}
    </LegoProvider>
    </>, divContainer.current);
};

/**
 * 鼠标离开设计区域清除hover状态
 */
interface BrickDesignProps extends IframeHTMLAttributes<any> {
  onLoadEnd?: () => void,
}

const stateSelector = ['componentConfigs'];


export function BrickDesign(props: BrickDesignProps) {

  const { componentConfigs } = useSelector(stateSelector);
  const designPage: any = useMemo(() => {
    if (!componentConfigs[ROOT]) return null;
    const { [ROOT]: { componentName } } = componentConfigs;
    const props = {
      specialProps: {
        domTreeKeys: [ROOT],
        key: ROOT,
        parentKey: '',
      },
    };
    return isContainer(componentName) ? <Container onMouseLeave={clearHovered}
                                                                        {...props} /> :
      <NoneContainer onMouseLeave={clearHovered} {...props}/>;
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
        <>
        <LegoProvider>
          {designPage}
        </LegoProvider>
          </>, divContainer.current);
  }, [divContainer.current, designPage]);

  const { onLoadEnd } = props;
  return (<iframe
      id="dnd-iframe"
      style={{ border: 0, width: '100%', height: '100%' }}
      srcDoc={iframeSrcDoc}
      onLoad={useCallback(() => {
        onIframeLoad(divContainer, designPage);
        onLoadEnd && onLoadEnd();
      }, [])}
      {...props}
    />
  );
}

