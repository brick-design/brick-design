import React, { forwardRef, memo, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Icon, Input, Row } from 'antd';
import { ChromePicker } from 'react-color';
import { propsAreEqual } from '../utils';

interface StringComponentPropsType {
  isFont: boolean;
  isShowInput: boolean;
  isShowColor: boolean;
  value: string;
  colorType: 'hex' | 'rgba';
  onChange: (value: string) => void;
  style: any;
  rowProps: any;
  inputColProps: any;
  colorColProps: any;
  inputProps: any;
  children: any;
}

function StringComponent(props: StringComponentPropsType, ref: any) {
  const {
    value,
    isShowInput = true,
    isShowColor = false,
    colorType = 'hex',
    onChange,
    children,
    isFont,
    style,
    rowProps = { gutter: 5 },
    inputColProps = { span: 18 },
    colorColProps = { span: 6 },
    inputProps = {},
  } = props;
  const [color, setColor] = useState(value);
  useEffect(() => {
    setColor(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onChange && onChange(color), 100);
    return () => clearTimeout(timer);
  }, [color]);

  function handleChangeColor(value: any) {
    let color;
    if (value.target) {
      color = value.target.value;
    } else {
      const {
        rgb: { r, g, b, a },
        hex,
      } = value;
      color = colorType === 'hex' ? hex : `rgba(${r},${g},${b},${a})`;
    }
    setColor(color);
  }

  const childNode = children || (isFont && <Icon type={'font-colors'} />);
  const colorStyle = childNode
    ? { color, fontSize: 16 }
    : { backgroundColor: color };
  return (
    <Row {...rowProps}>
      {isShowInput && (
        <Col {...inputColProps}>
          <Input
            allowClear
            size={'small'}
            value={color}
            onChange={handleChangeColor}
            {...inputProps}
          />
        </Col>
      )}
      {isShowColor && (
        <Col {...colorColProps}>
          <Dropdown
            trigger={['click']}
            overlay={
              <ChromePicker color={color} onChange={handleChangeColor} />
            }
          >
            <Button
              size={'small'}
              style={{ width: '100%', ...style, ...colorStyle }}
            >
              {childNode}
            </Button>
          </Dropdown>
        </Col>
      )}
    </Row>
  );
}

export default memo<StringComponentPropsType>(
  forwardRef(StringComponent),
  propsAreEqual,
);
