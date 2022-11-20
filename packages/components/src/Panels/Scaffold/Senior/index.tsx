import React, { memo } from 'react';
import { useSelector, changeSeniorProps } from '@brickd/canvas';
import { get } from 'lodash';

import { seniorConfigs } from './seniorConfigs';
import { ScaffoldForm } from '../../../Abilities';

const controlUpdate = (prevState: any, nextState: any) => {
  const { selectedInfo, pageConfig } = prevState;
  const { selectedKey } = selectedInfo || {};
  return (
    nextState.selectedInfo !== selectedInfo ||
    pageConfig[selectedKey] !== nextState.pageConfig[selectedKey]
  );
};
function Senior() {
  const { selectedInfo, pageConfig } = useSelector(
    ['selectedInfo', 'pageConfig'],
    controlUpdate,
  );
  const { selectedKey } = selectedInfo || {};
  const { componentName, childNodes, props, ...rest } = get(
    pageConfig,
    selectedKey,
    {},
  );

  const onValuesChange = (changedValues, values) => {
    changeSeniorProps({ props: values });
  };
  return (
    <ScaffoldForm
      lockKey={selectedKey}
      defaultFormData={rest}
      tip={!componentName && '请选中任意组件进行属性操作'}
      onValuesChange={onValuesChange}
      formConfig={seniorConfigs}
    />
  );
}

export default memo(Senior);
