import React, { Component } from 'react';
import { Input, Select, Tooltip } from 'antd';
import map from 'lodash/map';
import { connect } from 'dva';
import {ACTION_TYPES} from '@/models';
import {Dispatch} from 'redux';
import { TYPES_TO_COMPONENT } from '@/modules/settingsPanel/propsSettings/config';
const { Option } = Select;

interface SelectAddPropsType {
  dispatch?:Dispatch,
  parentFieldPath:string
}

interface SelectAddPropsStateType {
  newPropField: string,
  propType: string,
}

@connect()
export default class SelectAddProps extends Component<SelectAddPropsType,SelectAddPropsStateType> {
  constructor(props:SelectAddPropsType) {
    super(props);
    this.state = {
      newPropField: '',
      propType: 'string',
    };
  }

  addParam = () => {
    const { newPropField, propType } = this.state;
    const { dispatch, parentFieldPath } = this.props;
    if (/^[0-9a-zA-Z\$_][0-9a-zA-Z\d_]*$/.test(newPropField)) {
      dispatch!({
        type: ACTION_TYPES.addPropsConfig,
        payload:{
          newPropField,
          propType,
          parentFieldPath,
        }

      });
      this.setState({
        newPropField: '',
      });
    }
  };

  renderAddonBefore = () => {
    const { propType } = this.state;
    return <Select
      defaultValue={propType}
      onChange={v =>
        this.setState({
          propType: v,
        })
      }
    >
      {map(TYPES_TO_COMPONENT, (_,type) => (
        <Option value={type} key={type}>
          <Tooltip overlayStyle={{ zIndex: 1800 }} title={type}>
            {type}
          </Tooltip>
        </Option>
      ))}
    </Select>;
  };

  render() {
    const { newPropField } = this.state;
    return (
      <Input.Search
        addonBefore={this.renderAddonBefore()}
        placeholder="新增字段名称"
        value={newPropField}
        onChange={e =>
          this.setState({
            newPropField: e.target.value,
          })
        }
        onSearch={this.addParam}
        enterButton="Add"
      />
    );
  }
}
