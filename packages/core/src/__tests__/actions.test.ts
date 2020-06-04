import {
  addComponent,
  getDragSource,
  getDropTarget,
  undo,
  redo,
  overTarget,
  clearHovered,
  deleteComponent,
  selectComponent,
  copyComponent,
  changeStyles,
  clearSelectedStatus,
  onLayoutSortChange,
  changePlatform, clearChildNodes,
} from '../actions';
import {LegoProvider} from '../components/LegoProvider'
import {LEGO_BRIDGE} from '../store'
import config from './configs'
import { PropsNodeType, StateType } from '../types';

const getState=()=>LEGO_BRIDGE.store!.getState() as StateType
const dragSource={componentName:'div',defaultProps:{style:{}}}
const dropTarget={selectedKey:'root',domTreeKeys:['root']}

describe("actions 测试",()=>{
  jest.resetModules()
  beforeAll(()=>{
    LegoProvider({config})
  })
  it('平台切换',()=>{
    const mockPlatform={size:[1,2],isMobile:false}
    changePlatform(mockPlatform)
    expect(getState().platformInfo).toEqual(mockPlatform)
  })
  it('页面没有root组件时添加新组件',()=>{
    //单独触发add
    addComponent()
    expect(getState().componentConfigs).toEqual({})
    getDragSource(dragSource)
    //添加root节点
    addComponent()
    expect(getState().componentConfigs.root.componentName).toBe('div')

  })
  it("测试不同情况下的selectInfo",()=>{
    selectComponent({domTreeKeys:['root'],key:'root',propName:'children',parentKey:''})
    expect(getState().selectedInfo).not.toBeNull()
    getDragSource({componentName:'span'})
    addComponent()
    const selectKey=(getState().componentConfigs.root.childNodes as PropsNodeType).children[0]
    selectComponent({domTreeKeys:['root',selectKey],key:selectKey,propName:'children',parentKey:'root',parentPropName:'children'})
    const selectState=getState()
    selectComponent({domTreeKeys:['root'],key:'root',propName:'children',parentKey:''})
    expect(getState()).toBe(selectState)
    clearSelectedStatus()
    expect(getState()).toBe(selectState)
    //span中添加a
    getDragSource({componentName:'a'})
    addComponent()
    expect((getState().componentConfigs[selectKey].childNodes as PropsNodeType).children.length).toBe(1)
    selectComponent({domTreeKeys:['root',selectKey],key:selectKey,propName:'test',parentKey:'root',parentPropName:'children'})
    expect(getState().selectedInfo!.domTreeKeys).toEqual(
      expect.arrayContaining([`${selectKey}test`])
    )
    //测试fatherNodesRule
    getDragSource(dragSource)
    expect(addComponent).toThrow('div:只允许放入div.children组件或者属性中')
    //测试childNodesRule
    getDragSource({componentName:'img'})
    expect(addComponent).toThrow('test:只允许拖拽a组件')
    deleteComponent()
    expect(getState().componentConfigs[selectKey]).toBeUndefined()
  })

  it("页面有root组件时添加新组件",()=>{
    getDragSource(dragSource)
    const dragKey=getState().dragSource!.dragKey
    addComponent()
    //没有dropTarget
    expect(getState().componentConfigs[dragKey]).toBe(undefined)
    getDropTarget({})
    expect(getState().dropTarget).toBeNull()
    // 目标没有propName
    getDropTarget(dropTarget)
    expect(getState().dropTarget).toEqual(dropTarget)
    getDragSource(dragSource)
    expect(addComponent).toThrow()
    getDragSource(dragSource)
    const newDragKey=getState().dragSource!.dragKey
    getDropTarget({...dropTarget,propName:'children'})
    addComponent()
    expect(getState().componentConfigs[newDragKey]).not.toBeNull()
    getDragSource(dragSource)
    getDropTarget({...dropTarget,propName:'children'})
    addComponent()
  })
  it("拖拽设计面板中的组件嵌套",()=>{
    //添加一个新组件
    getDropTarget({...dropTarget,propName:'children'})
    getDragSource(dragSource)
    addComponent()
    const keys= (getState().componentConfigs.root.childNodes as PropsNodeType).children
    const dragKey=keys[0]
    getDragSource({dragKey,parentKey:'root',parentPropName:'children'})
    getDropTarget({})
    addComponent()
    //没有dropTarget
    expect(getState().dragSource).toBeNull()
    //有dropTarget
    const dropKey=keys[1]
    getDragSource({dragKey,parentKey:'root',parentPropName:'children'})

    getDropTarget({selectedKey:dropKey,domTreeKeys:['root',dropKey],propName:'children'})
    addComponent()
    expect(getState().componentConfigs[dropKey].childNodes).toEqual({children:[dragKey]})
    //测试undo
    undo()
    expect(getState().componentConfigs[dropKey].childNodes).toEqual({children:[]})
    //测试redo
    redo()
    expect(getState().componentConfigs[dropKey].childNodes).toEqual({children:[dragKey]})
    // 测试hover
    overTarget({hoverKey:dragKey!})
    expect(getState().hoverKey).toBe(dragKey)
    const hoverState=getState()
    //重复hover同一组件
    overTarget({hoverKey:dragKey!})
    expect(getState()).toBe(hoverState)
    //清除hover
    clearHovered()
    expect(getState().hoverKey).toBeNull()
    //当没有选中组件时删除组件
    const deleteState=getState()
    deleteComponent()
    expect(getState()).toBe(deleteState)
    //当没有选中组件时复制组件
    copyComponent()
    expect(getState()).toBe(deleteState)
    //当没有选中组件时设置样式
    changeStyles({style:{}})
    expect(getState()).toBe(deleteState)
    //选中组件
    selectComponent({key:dragKey!,parentKey:dropKey!,parentPropName:'children',domTreeKeys:['root',dropKey,dragKey!]})
    expect(getState().selectedInfo?.selectedKey).toBe(dragKey)
    //复制选中组件
    copyComponent()
    const childKeys=(getState().componentConfigs[dropKey].childNodes as PropsNodeType).children
      expect(childKeys.length).toBe(2)
    //组件内排序
    const sortKeys=[...childKeys].reverse()
    onLayoutSortChange({sortKeys,parentKey:dropKey,parentPropName:'children'})
    expect(getState().componentConfigs[dropKey].childNodes).toEqual({children:sortKeys})
    //跨组件排序
    const dragSortKey=sortKeys[0]
    const rootSortKeys=(getState().componentConfigs.root.childNodes as PropsNodeType).children

    onLayoutSortChange({sortKeys:[...rootSortKeys,dragSortKey],parentKey:'root',parentPropName:'children',dragInfo:{key:dragSortKey,parentKey:dropKey,parentPropName:'children'}})
    expect((getState().componentConfigs[dropKey].childNodes as PropsNodeType).children).toEqual(
      expect.not.arrayContaining([dragSortKey])
    )
    expect((getState().componentConfigs['root'].childNodes as PropsNodeType).children).toEqual(
      expect.arrayContaining([dragSortKey])
    )
    //更改样式
    changeStyles({style:{}})
    expect(getState().componentConfigs[dragKey!].props.style).toEqual({})
    //删除根节点组件
    selectComponent({key:'root',propName:'children',parentKey:'',domTreeKeys:['root']})
    deleteComponent()
    expect(getState().componentConfigs).toEqual({})
    //有选中的组件触发清除选中
    undo()
    expect(getState().selectedInfo).not.toBeNull()
    //清除子节点
    clearChildNodes()
    expect(getState().componentConfigs.root.childNodes).toEqual({children:[]})
    clearSelectedStatus()
    expect(getState().selectedInfo).toBeNull()
    const clearState=getState()
    // 没有选中的组件触发清除选中
    clearChildNodes()
    expect(getState()).toBe(clearState)
    // getDropTarget(dropTarget)
    // expect(getState().dropTarget).toEqual(dropTarget)
    // getDragSource(dragSource)
    // const newDragKey=getState().dragSource!.dragKey
    // addComponent()
    // expect(getState().componentConfigs[newDragKey].componentName).toBe('div')
  })
})
