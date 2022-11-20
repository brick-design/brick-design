import React, { memo, useMemo } from 'react';
import {
  getComponentConfig,
  useSelector,
  changeProps,
  PageConfigType,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/canvas';
import { get, isEmpty } from 'lodash';
import { VirtualDOMType } from '@brickd/utils';
import { splitPropsConfig } from '../../../utils';
import { ScaffoldForm } from '../../../Abilities';

const controlUpdate = (prevState: any, nextState: any) => {
  const { selectedInfo, pageConfig } = prevState;
  const { selectedKey } = selectedInfo || {};
  const props = get(pageConfig, `${selectedKey}.props`);
  return (
    nextState.selectedInfo !== selectedInfo ||
    props !== get(nextState.pageConfig, `${selectedKey}.props`)
  );
};
type PropsType = {
  isCommon?: boolean;
};

type PropsHookState = {
  pageConfig: PageConfigType;
  selectedInfo: SelectedInfoType;
};

function Props({ isCommon }: PropsType) {
  const { selectedInfo, pageConfig } = useSelector<PropsHookState, STATE_PROPS>(
    ['selectedInfo', 'pageConfig'],
    controlUpdate,
  );
  const { selectedKey } = selectedInfo || {};
  const { componentName, props, childNodes } = get(
    pageConfig,
    selectedKey,
    {},
  ) as VirtualDOMType;
  const { propsConfig } = getComponentConfig(componentName);
  const { firstConfig, secondConfig } = useMemo(
    () => splitPropsConfig(propsConfig, childNodes),
    [propsConfig, childNodes],
  );
  const formConfig = isCommon ? firstConfig : secondConfig;

  const onValuesChange = (changedValues) => {
    changeProps({ isMerge: true, props: changedValues });
  };
  let tip = null;
  if (!componentName || isEmpty(formConfig)) {
    tip = '请选中任意组件进行属性操作';
    if (componentName && isEmpty(formConfig)) {
      tip = '该组件暂未有可操作的属性';
    }
  }
  return (
    <ScaffoldForm
      defaultFormData={props}
      lockKey={selectedKey}
      tip={tip}
      onValuesChange={onValuesChange}
      formConfig={formConfig}
    />
  );
}

export default memo(Props);
