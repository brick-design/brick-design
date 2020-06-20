import { clearChildNodes, copyComponent, deleteComponent } from 'brickd-core';

interface ActionSheetConfig{
  icon:string,
  action:()=>{}
}

export const ACTIONS={
  delete:'delete',
  copy:'copy',
  clear:'clear'
}
const configs:ActionSheetConfig[]= [
  {
icon:ACTIONS.delete,
  action:deleteComponent
},
  {
    icon:ACTIONS.copy,
    action:copyComponent
  },
  {
    icon:ACTIONS.clear,
    action:clearChildNodes
  }
]

export default configs
