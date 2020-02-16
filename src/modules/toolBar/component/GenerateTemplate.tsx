import React, { PureComponent } from 'react';
import {Button, Form,Spin,Input } from 'antd';
import { DefaultImgBase64 } from '@/modules/toolBar/config';
import html2canvas from 'html2canvas';
import { FormComponentProps } from 'antd/lib/form';

const { Item } = Form;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const formButtonLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

interface GenerateTemplatePropsType extends FormComponentProps{
  uploadFile?:any
}

interface GenerateTemplateStateType {
  srcImg: string,
  spinning:boolean
}

class GenerateTemplate extends PureComponent<GenerateTemplatePropsType,GenerateTemplateStateType> {
  constructor(props:GenerateTemplatePropsType) {
    super(props);
    this.state={
      srcImg: DefaultImgBase64,
      spinning:false
    }
  }

  componentDidMount(){
    this.generateCompositeComponents()
  }


  submit = (e:any) => {
    e.preventDefault();
    const { form: { validateFields }, uploadFile} = this.props;
    const {srcImg}=this.state
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const {templateName}=fieldsValue
      uploadFile && uploadFile({ templateName, srcImg });
    });
  };
  generateCompositeComponents = () => {

    const testDom = document.getElementById('select-img');
    if (!testDom) return
    this.setState({
      spinning:true
    })
    html2canvas(testDom).then((img) => {
      this.setState({
        spinning: false,
        srcImg: img.toDataURL(),
      });
    });
  };
  render() {
    const { srcImg,spinning } = this.state;
    const {form:{getFieldDecorator}}=this.props
    return (
      <Form>

        <Item {...formItemLayout} label={'模板名字'}>
          {getFieldDecorator('templateName', { rules:[{ required: true, message: '模板名不能为空' }] })
          (<Input/>)}
        </Item>
        <Item label='图片' {...formItemLayout}>
          <Spin spinning={spinning}>
          <img style={{ width: '100%', height: 200 }} src={srcImg}/>
          </Spin>
        </Item>
        <Item {...formButtonLayout}>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </Item>
      </Form>
    );
  }
}

export default Form.create<GenerateTemplatePropsType>()(GenerateTemplate)
