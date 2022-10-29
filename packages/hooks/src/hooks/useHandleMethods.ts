import { useEffect, useRef } from 'react';
import { LIFE_CYCLE, MethodsType } from '@brickd/utils';
import { each } from 'lodash';

export function useHandleMethods(
  state: any,
  nodeRef: any,
  methods?: MethodsType,
) {
  const renderTime = useRef(0);
  const funMap = useRef({});

  if (!renderTime.current) {
    let funNum = 0;
    each(methods, (method) => {
      const { funContent, lifeCycle } = method;
      const fun = new Function(`return ${funContent}`)();
      const funName = fun.name;
      each(lifeCycle, (life) => {
        if (funName) {
          funMap.current[life][funName] = fun;
        } else {
          funMap.current[life][`fun` + funNum] = fun;
          funNum++;
        }
      });
    });
    each(funMap.current[LIFE_CYCLE.init], (fun) => {
      fun(state, funMap.current, nodeRef);
    });
    renderTime.current++;
  }
  if (renderTime.current > 1) {
    each(funMap.current[LIFE_CYCLE.willUpdate], (fun) => {
      fun(state, funMap.current, nodeRef);
    });

    renderTime.current++;
  }

  useEffect(() => {
    each(funMap.current[LIFE_CYCLE.didMount], (fun) => {
      fun(state, funMap.current, nodeRef);
    });
    return () => {
      each(funMap.current[LIFE_CYCLE.willUnmount], (fun) => {
        fun(state, funMap.current, nodeRef);
      });
    };
  }, []);

  useEffect(() => {
    if (renderTime.current > 1) {
      each(funMap.current[LIFE_CYCLE.didUpdate], (fun) => {
        fun(state, funMap.current, nodeRef);
      });
    }
  }, [renderTime.current]);
}
