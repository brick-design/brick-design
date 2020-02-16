import React, { Component } from 'react';
import map from 'lodash/map';
import { Button, Col, Dropdown, Row, TreeSelect } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import options from './config';

const { TreeNode } = TreeSelect;
interface AnimatePropsType {
  value:string,
  onChange:(value:any)=>void
}

interface AnimateStateType {
  animateName: string,
  dropdownVisible:boolean
}
class Animate extends Component<AnimatePropsType,AnimateStateType> {


  constructor(props:AnimatePropsType) {
    super(props);

    this.state = {
      animateName: '',
      dropdownVisible: false,
    };
  }

  static getDerivedStateFromProps(nextProps:AnimatePropsType) {
    const { value } = nextProps;
    return { animateName: value ? value.split(' ')[0] : '' };

  }

  handleChange = (val:any) => {
    const { onChange } = this.props;
    let animatedClass = val ? `${val} animated` : undefined;
    onChange && onChange(animatedClass);
  };

  animateIt = () => {
    const { dropdownVisible } = this.state;
    this.setState({
      dropdownVisible: !dropdownVisible,
    });
  };


  renderSelect = (animateName:string) => (
    <TreeSelect
      showSearch
      value={animateName}
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      treeDefaultExpandAll
      dropdownMatchSelectWidth
      className={styles['select-box']}
      onChange={this.handleChange}
    >
      {
        map(options, (optGroup) => (
            <TreeNode value={optGroup.title} title={optGroup.title} key={optGroup.title} disabled>
              {map(optGroup.data, option => (
                <TreeNode value={option} title={option} key={option}/>
              ))}
            </TreeNode>
          ),
        )
      }
    </TreeSelect>
  );

  renderAnimateBox = (animateName:string) => {

    const animateClass = animateName ? `${animateName} animated` : '';

    return (
      <div className={styles['animate-wrap']}>
        {/* //这里一定要加上key
            //className是animate.css中的类名，显示不同动画 */}
        <div key="amache" className={classNames(styles['animate-box'], animateClass)}>
          Animate
        </div>
      </div>
    );
  };

  render() {
    const { dropdownVisible, animateName } = this.state;
    return (
      <Row gutter={10} className={styles['animate-component-warp']}>
        <Col style={{ lineHeight: 0 }} span={14}>
          {this.renderSelect(animateName)}
        </Col>
        <Col style={{ lineHeight: 0, position: 'relative' }} span={10} id='drop-down'>
          <Dropdown visible={dropdownVisible}
                    getPopupContainer={(triggerNode:any) => triggerNode}
                    overlay={this.renderAnimateBox(animateName)}
                    placement="bottomRight">
            <Button size={'small'} className={styles['animate-btn']} onClick={this.animateIt}>Animate It</Button>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Animate;
