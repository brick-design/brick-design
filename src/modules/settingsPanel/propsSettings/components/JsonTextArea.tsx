import React, { Component } from 'react';
import { Input } from 'antd';
import isObject from 'lodash/isObject'
import debounce from 'lodash/debounce'
const { TextArea } = Input;

interface JsonTextAreaStateType {
  str:string,
  jsonStr?:string
}

interface JsonTextAreaPropsType {
  value?:any,
  onChange:(value:any)=>void
}
export default class JsonTextArea extends Component<JsonTextAreaPropsType,JsonTextAreaStateType> {
  constructor(props:JsonTextAreaPropsType){
    super(props)
    this.state={
      str:'',
      jsonStr:undefined
    }
  }

  static getDerivedStateFromProps(nextProps:JsonTextAreaPropsType,state:JsonTextAreaStateType){
    const {value}=nextProps
    const {jsonStr:prevJsonStr}=state
    if(isObject(value)){
      const jsonStr=JSON.stringify(value,null,2)
      if(jsonStr!==prevJsonStr){
        return{
          str:jsonStr,
          jsonStr
        }
      }
    }

    return null
  }


  shouldComponentUpdate(nextProps:JsonTextAreaPropsType, nextState:JsonTextAreaStateType) {
    const {value:prevValue}=this.props
    const {value}=nextProps
    const {str}=nextState
    const {str:prevStr}=this.state
    return prevValue!==value||str!==prevStr

  }


  formatStr=()=>{
    const {onChange}=this.props
    const {str}=this.state
    try {
      let strObj;
      eval(`strObj=${str}`)
      if(isObject(strObj)){
        onChange && onChange(strObj);
      }
    } catch (e) {}
  }


  handleChange = (e:any) => {
    // 去掉回车换行
    this.setState({
      str:e.target.value
    },debounce(this.formatStr,150))


  };

  render() {
    const { str } = this.state;
    return (
      <TextArea value={str} onChange={this.handleChange}/>
    );
  }
}
