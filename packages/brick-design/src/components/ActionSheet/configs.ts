import { clearChildNodes, copyComponent, deleteComponent } from 'brickd-core';

interface ActionSheetConfig{
  icon:string,
  action:()=>{}
}

const configs:ActionSheetConfig[]= [{
icon:'delete',
  action:deleteComponent
},
  {
    icon:'copy',
    action:copyComponent
  },
  {
    icon:'clear',
    action:clearChildNodes
  }
]

export default configs
