import React, { Component } from 'react';
import { Button, Col, Input, Row, Dropdown } from 'antd';
import { ChromePicker } from 'react-color';
import {Icon} from '@/components';

interface StringComponentPropsType{
  isFont:boolean,
  isShowInput:boolean,
  isShowColor:boolean,
  value:string,
  colorType:'hex'|'rgba',
  onChange:(value:string)=>void,
  style:any,
  rowProps:any,
  inputColProps:any,
  colorColProps:any,
  inputProps:any,


}

interface StringComponentStateType {
  color:string
}
export default class StringComponent extends Component<StringComponentPropsType,StringComponentStateType> {

  static defaultProps = {
    isFont: false,
    isShowInput: true,
    isShowColor: false,
    colorType : 'hex',
  };

  colorTimer:any;

  constructor(props:StringComponentPropsType) {
    super(props);
    this.state = {
      color: '',
    };
    this.colorTimer = null;
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      color: value,
    });
  }

  shouldComponentUpdate(nextProps:StringComponentPropsType, nextState:StringComponentStateType) {
    const { value } = nextProps;
    const { color } = nextState;
    const { color: prevColor } = this.state;
    const { value: prevValue } = this.props;

    return value !== prevValue || color !== prevColor;
  };

  componentDidUpdate(prevProps:StringComponentPropsType, prevState:StringComponentStateType) {
    const { value: prevValue } = prevProps;
    const { value } = this.props;
    value !== prevValue && this.setState({
      color: value,
    });
  }

  handleChangeColor = (value:any) => {
    const { colorType } = this.props;
    let color;
    if (value.target) {
      color = value.target.value;
    } else {
      const { rgb: { r, g, b, a }, hex } = value;
      color = colorType === 'hex' ? hex : `rgba(${r},${g},${b},${a})`;
    }
    const { onChange } = this.props;
    this.setState({
      color: color,
    }, () => {
      this.colorTimer && clearTimeout(this.colorTimer);
      this.colorTimer = setTimeout(() => onChange && onChange(this.state.color), 100);
    });
  };

  componentWillUnmount() {
    this.colorTimer && clearTimeout(this.colorTimer);
  }


  render() {
    const { color } = this.state;
    let {
      children,
      isFont,
      isShowInput,
      isShowColor,
      style,
      rowProps = { gutter: 5 },
      inputColProps = { span: 18 },
      colorColProps = { span: 6 },
      inputProps = {},
    } = this.props;
    children = children || isFont && <Icon type={'font-colors'}/>;
    const colorStyle = children ? { color, fontSize: 16 } : { backgroundColor: color };
    return (
      <Row {...rowProps}>
        {isShowInput && <Col {...inputColProps}>
          <Input allowClear size={'small'} value={color} onChange={this.handleChangeColor} {...inputProps}/>
        </Col>}
        {isShowColor && <Col {...colorColProps}>
          <Dropdown
            trigger={["click"]}
            overlay={<ChromePicker color={color} onChange={this.handleChangeColor}/>}>
            <Button size={'small'} style={{ width: '100%', ...style, ...colorStyle }}>
              {children}
            </Button>
          </Dropdown>
        </Col>}
      </Row>
    );
  }
}

