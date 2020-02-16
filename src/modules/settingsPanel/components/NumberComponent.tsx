import React, { Component } from 'react';
import { Col, InputNumber, Row } from 'antd';
import styles from './index.less';
import {EnumComponent} from './index'
const UNITS = [
  'px', '%', 'em', 'rem',
];

interface NumberComponentStateType {
  number:number,
  unit:string,
}
const formatValue = (value:string, units:string[], hasUnit:boolean) => {
  if (!value) return {unit:'px'};
  if (hasUnit) {
    for (const unit of units) {
      if (value.toString().indexOf(unit) > -1) {
        const tempValue = value.split(unit);
        return { number: tempValue[0], unit };
      }
    }
  } else {
    return { number: value };
  }
};

interface NumberComponentPropsType {
  units:string[],
  hasUnit:boolean,
  numberSpan:number,
  unitSpan:number,
  value:string,
  onChange:(value:string|number)=>any,
  size?:'large' | 'small' | 'default',
  numberDisabled:boolean
}



export default class NumberComponent extends Component<NumberComponentPropsType,NumberComponentStateType> {

  static  defaultProps = {
    units: UNITS,
    hasUnit: false,
    numberSpan: 13,
    unitSpan: 11,
  };

  numberTimer:any

  constructor(props:NumberComponentPropsType) {
    super(props);
    const { units, value, hasUnit } = props;
    const { number, unit = 'px' }:any = formatValue(value, units, hasUnit);
    this.state = {
      number,
      unit,
    };
  }

  shouldComponentUpdate(nextProps:NumberComponentPropsType, nextState:NumberComponentStateType) {
    const { value } = nextProps;
    const { value: prevValue } = this.props;
    const { number, unit } = nextState;
    const { number: prevNumber, unit: prevUnit } = this.state;
    return value !== prevValue || number !== prevNumber || unit !== prevUnit;
  }

  componentDidUpdate(prevProps:NumberComponentPropsType, prevState:NumberComponentStateType) {
    const { value: prevValue } = prevProps;
    const { value, units, hasUnit } = this.props;
    if (value !== prevValue) {
      const { number, unit }:any = formatValue(value, units, hasUnit);
      this.setState({ number, unit });
    }
  }

  componentWillUnmount() {
    this.numberTimer && clearTimeout(this.numberTimer);
  }

  numberChange = (number:any) => {
    this.setState({number},()=>{
      this.numberTimer && clearTimeout(this.numberTimer);
      this.numberTimer = setTimeout(this.outputData,100);
    })
  }

  unitChange = (unit:string) => {
    this.setState({
      unit: unit,
    }, this.outputData);

  };

  outputData = () => {
    const { onChange, hasUnit } = this.props;
    const { unit, number } = this.state;
    const outputValue = hasUnit ? `${number}${unit}` : number;
    onChange && onChange(outputValue);
  };

  render() {
    const { units, hasUnit, numberSpan, unitSpan, size, numberDisabled } = this.props;
    const { number, unit } = this.state;
    return (
      <Row className={styles['number-unit-container']}>
        <Col  span={numberSpan}>
          <InputNumber className={styles['input-num']}
                       disabled={numberDisabled}
                       value={number}
                       size={size}
                       onChange={this.numberChange}/>
        </Col>
        {hasUnit && <Col  span={unitSpan}>
          <EnumComponent
            allowClear={false}
            value={unit}
            enumData={units}
            onChange={this.unitChange}
          />

        </Col>}
      </Row>
    );
  }

}
