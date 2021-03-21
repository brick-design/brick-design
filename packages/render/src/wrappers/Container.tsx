import React, {
  createElement,
  memo,
  useCallback,
  useContext,
  useMemo,
  forwardRef,
} from 'react';
import { each, get, map } from 'lodash';
import {
  FunParamContextProvider,
  useCommon,
  StaticContext,
} from '@brickd/hooks';
import { getChildrenFields, isPureVariable, resolveMapping } from '@brickd/utils';
import StateDomainWrapper from './StateDomainWrapper';
import MapNodesRenderWrapper from './MapNodesRenderWrapper';
import ContainerDiffWrapper from './ContainerDiffWrapper';
import { useHandleProps } from '../hooks/useHandleProps';

/**
 * 所有的容器组件名称
 */
export interface CommonPropsType {
  renderKey: string;
  [propName: string]: any;
}
function Container(vProps: CommonPropsType, ref: any) {
  const { renderKey, ...rest } = vProps;
  const { pageConfig, componentsMap } = useContext(StaticContext);
  const vNode = pageConfig[renderKey];
  const { componentName, childNodes } = vNode;
  const { props, hidden, pageState } = useCommon(vNode, rest,getChildrenFields(pageConfig,childNodes));

  const renderArrChild = useCallback(
    (childNodes: string[]) => {
      return childNodes.map((nodeKey) => {
        const { childNodes, isStateDomain, loop } = pageConfig[nodeKey];
        let isContainer = false;
        if (childNodes) {
          isContainer = true;
        }
        if (isStateDomain)
          return <StateDomainWrapper renderKey={nodeKey} key={nodeKey} />;
        if (
          (typeof loop === 'string' && isPureVariable(loop)) ||
          Array.isArray(loop)
        ) {
          return map(
            Array.isArray(loop)
              ? loop
              : resolveMapping(loop, {
                  ...pageState,
                  ...pageState.getPageState(),
                }),
            (item, index) => {
              return (
                <MapNodesRenderWrapper
                  isContainer={isContainer}
                  renderKey={nodeKey}
                  index={index}
                  key={`${item.key || item.id || index}${renderKey}`}
                  item={item}
                />
              );
            },
          );
        }
        return (
          <ContainerDiffWrapper
            renderKey={nodeKey}
            isContainer={isContainer}
            key={renderKey}
          />
        );
      });
    },
    [pageConfig, pageState],
  );

  const nodeProps = useMemo(() => {
    const nodeProps = {};
    if (Array.isArray(childNodes)) {
      nodeProps['children'] = renderArrChild(childNodes);
    } else {
      each(childNodes, (nodes, propName) => {
        if (propName.includes('#')) {
          const realPropName = propName.substring(1);
          // eslint-disable-next-line react/display-name
          nodeProps[realPropName] = (...funParams) => {
            return (
              <FunParamContextProvider value={funParams}>
                {renderArrChild(nodes)}
              </FunParamContextProvider>
            );
          };
        } else {
          nodeProps[propName] = renderArrChild(nodes);
        }
      });
    }
    return nodeProps;
  }, [pageConfig, childNodes, renderArrChild]);

  const propsResult = useHandleProps(props, ref, nodeProps);

  if (hidden) return null;

  return createElement(
    get(componentsMap, componentName, componentName),
    propsResult,
  );
}

export default memo<CommonPropsType>(forwardRef(Container));
