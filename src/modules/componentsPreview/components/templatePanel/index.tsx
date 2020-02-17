import React, { Component } from 'react';
import { Input, Modal, Spin } from 'antd';
import map from 'lodash/map';
import ListItem from './listItem';
import {ACTION_TYPES} from '@/models';
import styles from '../index.less';
import {Dispatch} from 'redux'
import { TemplateInfoType } from '@/types/ModelType';

const DELETE_TEMPLATE = '您确定要删除此模板？';

interface TemplatePanelPropsType {
  dispatch:Dispatch,
  isShow:boolean,
  templateInfos:TemplateInfoType[]
}

interface TemplatePanelStateType {
  loading:boolean,
  imgSrc:string,
  previewVisible:boolean
}

class TemplatePanel extends Component<TemplatePanelPropsType,TemplatePanelStateType> {
  constructor(props:TemplatePanelPropsType) {
    super(props);

    this.state = {
      loading: false,
      previewVisible: false,
      imgSrc:''
    };
  }

  componentDidMount() {
    // 获取复合组件
    const { dispatch } = this.props;
    dispatch({
      type: ACTION_TYPES.getTemplateList,
    });
  }

  shouldComponentUpdate(nextProps:TemplatePanelPropsType) {
    const { isShow } = nextProps;
    return isShow;
  }

  previewImg = (imgSrc:string) => {
    this.setState({
      imgSrc,
      previewVisible: true,
    });
  };

  deleteItem = (id:string) => {
    const { dispatch } = this.props;
    Modal.confirm({
      content: DELETE_TEMPLATE,
      onOk() {
        dispatch({
          type: ACTION_TYPES.deleteTemplate,
          payload: { id },
        });
      },
    });

  };

  handleCancel = () => this.setState({ previewVisible: false });

  onSearch=(e:any)=>{
    const {dispatch}=this.props
    const searchValue=e.target.value
    dispatch({
      type:searchValue?ACTION_TYPES.searchTemplate:ACTION_TYPES.getTemplateList,
      payload: {
        searchValue
      }
    })

  }

  render() {
    const { loading, imgSrc, previewVisible } = this.state;
    const { templateInfos,dispatch } = this.props;
    return (
      <>
        <Input.Search onPressEnter={this.onSearch}/>
        <Spin spinning={loading}>
          <div className={styles['all-components']}>
            {map(templateInfos, val => {
              const item = { templateData: JSON.parse(val.config) };
              return <ListItem key={val.id}
                               dispatch={dispatch}
                               item={item}
                               deleteItem={this.deleteItem}
                               previewImg={this.previewImg}
                               itemData={val}/>;
            })}
          </div>
        </Spin>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%', height: 500 }} src={imgSrc}/>
        </Modal>
      </>
    );
  }
}

export default TemplatePanel
