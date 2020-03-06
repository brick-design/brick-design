import React, { useState } from 'react';
import { Input, Select, Tooltip } from 'antd';
import map from 'lodash/map';
import { connect } from 'dva';
import { ACTION_TYPES } from '@/models';
import { Dispatch } from 'redux';
import { TYPES_TO_COMPONENT } from '@/modules/settingsPanel/propsSettings/config';

const { Option } = Select;

interface SelectAddPropsType {
  dispatch?: Dispatch,
  parentFieldPath: string
}


function SelectAddProps(props: SelectAddPropsType) {
  const [newPropField, setNewPropField] = useState();
  const [propType, setPropType] = useState('string');

  function addParam() {
    const { dispatch, parentFieldPath } = props;
    if (/^[0-9a-zA-Z\$_][0-9a-zA-Z\d_]*$/.test(newPropField)) {
      dispatch!({
        type: ACTION_TYPES.addPropsConfig,
        payload: {
          newPropField,
          propType,
          parentFieldPath,
        },
      });
      setNewPropField('');

    }
  };

  function renderAddonBefore() {
    return <Select
      defaultValue={propType}
      onChange={v => setPropType(v)}
    >
      {map(TYPES_TO_COMPONENT, (_, type) => (
        <Option value={type} key={type}>
          <Tooltip overlayStyle={{ zIndex: 1800 }} title={type}>
            {type}
          </Tooltip>
        </Option>
      ))}
    </Select>;
  }

  return (
    <Input.Search
      addonBefore={renderAddonBefore()}
      placeholder="新增字段名称"
      value={newPropField}
      onChange={e => setNewPropField(e.target.value)}
      onSearch={addParam}
      enterButton="Add"
    />
  );
}

export default connect()(SelectAddProps);
