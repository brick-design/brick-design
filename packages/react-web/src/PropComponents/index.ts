import { Modal } from 'antd';

export { default as ObjectComponent } from './ObjectComponent/ObjectComponent';
export { default as ObjectArrayComponent } from './ObjectArrayComponent/ObjectArrayComponent';
export { default as SortComponent } from './ObjectArrayComponent/SortComponent';
export { default as StringArray } from './StringArray';
export { default as JsonTextArea } from './JsonTextArea';
export { default as NumberArray } from './NumberArray';
export { default as FunctionComponent } from './FunctionComponent';
export { default as StringComponent } from './StringComponent';
export { default as EnumComponent } from './EnumComponent';
export { default as SwitchMultiTypes } from './SwitchMultiTypes';

export const confirmModal = (fnBsn: () => void) =>
  Modal.confirm({
    title: '你确定要删除此项吗?',
    onOk() {
      fnBsn();
    },
  });
