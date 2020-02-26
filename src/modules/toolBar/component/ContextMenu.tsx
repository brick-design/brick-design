import React, { PureComponent} from 'react'
import map from 'lodash/map'
import styles from '../style.less'
import { Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import get from "lodash/get";

interface ContextMenuPropsType {
  dispatch?:Dispatch,
  isSelected:boolean,
  enableMenu:string[],
  parentThis:any
}

interface ContextMenuStateType {
  visible:boolean

}


class ContextMenu extends PureComponent<ContextMenuPropsType,ContextMenuStateType> {
  root:any;

  state:ContextMenuStateType={
    visible:false
  }

  static getDerivedStateFromProps(nextProps:ContextMenuPropsType){
    const {isSelected}=nextProps
    if(!isSelected){
      return{visible:false}
    }

    return  null

  }
  componentDidMount() {
    // 添加右键点击、点击事件监听
    addEventListener('contextmenu', this.handleContextMenu)
    addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    // 移除事件监听
    removeEventListener('contextmenu', this.handleContextMenu)
    removeEventListener('click', this.handleClick)
  }

  // 鼠标单击事件，当鼠标在任何地方单击时，设置菜单不显示
  handleClick = () => {
    const { visible } = this.state
    if (visible) {
      this.setState({ visible: false })
    }
  };

  // 右键菜单事件
  handleContextMenu = (event:any) => {
    const {isSelected}=this.props
    if(!isSelected) return
    event.preventDefault()
    this.setState({visible:true})
    const {clientX,clientY}=event
    const {innerWidth,innerHeight}=window
    const{offsetWidth,offsetHeight}=this.root
    const right = (innerWidth - clientX) > offsetWidth
    const left = !right
    const bottom = (innerHeight - clientY) > offsetHeight
    const top = !bottom
    if (right) {
      this.root.style.left = `${clientX}px`
    }
    if (left) {
      this.root.style.left = `${clientX - offsetWidth}px`
    }

    if (bottom) {
      this.root.style.top = `${clientY}px`
    }
    if (top) {
      this.root.style.top = `${clientY - offsetHeight}px`
    }
  };

  render() {
    const {visible}=this.state
    const {enableMenu,parentThis}=this.props
    return (
      visible && (
        <div  ref={(ref)=>this.root=ref}  className={styles["contextMenu-wrap"]} >
          {map(enableMenu,(menu,key)=><div
            onClick={get(parentThis,menu)}
            key={key}
            className={styles["contextMenu-option"]}>{formatMessage({id:`BLOCK_NAME.toolBar.${menu}`})}</div>
          )}

        </div>
      )
    )
  }
}

export default ContextMenu
