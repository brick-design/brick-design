import { clearChildNodes, copyComponent, deleteComponent } from '@brickd/core';
import deleteSvg from '../../assets/delete.svg';
import copySvg from '../../assets/copy.svg';
import clearSvg from '../../assets/clear.svg';

interface ActionSheetConfig {
  icon: any;
  action: () => {};
  type: string;
}

export const ACTIONS = {
  delete: 'delete',
  copy: 'copy',
  clear: 'clear',
};
const configs: ActionSheetConfig[] = [
  {
    type: ACTIONS.delete,
    action: deleteComponent,
    icon: deleteSvg,
  },
  {
    type: ACTIONS.copy,
    action: copyComponent,
    icon: copySvg,
  },
  {
    type: ACTIONS.clear,
    action: clearChildNodes,
    icon: clearSvg,
  },
];

export default configs;
