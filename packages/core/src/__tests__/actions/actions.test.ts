import {
  addComponent,
  addPropsConfig,
  AddPropsConfigPayload,
  changePlatform,
  changeProps,
  ChangePropsPayload,
  changeStyles,
  clearChildNodes,
  clearDragSource,
  clearDropTarget,
  clearHovered,
  clearSelectedStatus,
  copyComponent,
  deleteComponent,
  deletePropsConfig,
  DeletePropsConfigPayload,
  DragSourcePayload,
  getDragSource,
  getDropTarget,
  LayoutSortPayload,
  onLayoutSortChange,
  overTarget,
  OverTargetPayload,
  redo,
  resetProps,
  resetStyles,
  resizeChange,
  ResizePayload,
  selectComponent,
  SelectComponentPayload,
  stylePayload,
  undo,
} from '../../actions';
import ACTION_TYPES from '../../actions/actionTypes';
import { BrickAction, DropTargetType, PlatformInfoType } from '../../types';

jest.mock('../../utils', () => ({
  createActions: (action: BrickAction) => action,
}));

describe('actions test', () => {
  test('test actions', () => {
    // componentSchema
    expect(addComponent()).toEqual({ type: ACTION_TYPES.addComponent });
    expect(copyComponent()).toEqual({ type: ACTION_TYPES.copyComponent });
    const payload: LayoutSortPayload = { sortKeys: [], parentKey: '' };
    expect(onLayoutSortChange(payload)).toEqual({
      type: ACTION_TYPES.onLayoutSortChange,
      payload,
    });
    expect(deleteComponent()).toEqual({ type: ACTION_TYPES.deleteComponent });
    expect(clearChildNodes()).toEqual({ type: ACTION_TYPES.clearChildNodes });
    //dragDrop
    const dragPayload: DragSourcePayload = { dragKey: '', parentKey: '' };
    expect(getDragSource(dragPayload)).toEqual({
      type: ACTION_TYPES.getDragSource,
      payload: dragPayload,
    });
    const dropPayload: DropTargetType = { selectedKey: '', domTreeKeys: [] };
    expect(getDropTarget(dropPayload)).toEqual({
      type: ACTION_TYPES.getDropTarget,
      payload: dropPayload,
    });
    expect(clearDropTarget()).toEqual({ type: ACTION_TYPES.clearDropTarget });
    expect(clearDragSource()).toEqual({ type: ACTION_TYPES.clearDragSource });

    //hover
    const hoverPayload: OverTargetPayload = { hoverKey: '' };
    expect(overTarget(hoverPayload)).toEqual({
      type: ACTION_TYPES.overTarget,
      payload: hoverPayload,
    });
    expect(clearHovered()).toEqual({ type: ACTION_TYPES.clearHovered });
    //platform
    const changePlatformPayload: PlatformInfoType = {
      size: [],
      isMobile: true,
    };
    expect(changePlatform(changePlatformPayload)).toEqual({
      type: ACTION_TYPES.changePlatform,
      payload: changePlatformPayload,
    });
    //props
    const changePropsPayload: ChangePropsPayload = { props: {} };
    expect(changeProps(changePropsPayload)).toEqual({
      type: ACTION_TYPES.changeProps,
      payload: changePropsPayload,
    });
    expect(resetProps()).toEqual({ type: ACTION_TYPES.resetProps });
    //redoUndo
    expect(redo()).toEqual({ type: ACTION_TYPES.redo });
    expect(undo()).toEqual({ type: ACTION_TYPES.undo });
    //selectedComponent
    const selectComponentPayload: SelectComponentPayload = {
      domTreeKeys: [],
      key: '',
      parentKey: '',
    };
    expect(selectComponent(selectComponentPayload)).toEqual({
      type: ACTION_TYPES.selectComponent,
      payload: selectComponentPayload,
    });
    expect(clearSelectedStatus()).toEqual({
      type: ACTION_TYPES.clearSelectedStatus,
    });
    //styles
    const changeStylePayload: stylePayload = { style: {} };
    expect(changeStyles(changeStylePayload)).toEqual({
      type: ACTION_TYPES.changeStyles,
      payload: changeStylePayload,
    });
    expect(resetStyles()).toEqual({ type: ACTION_TYPES.resetStyles });
    const resizePayload: ResizePayload = {};
    expect(resizeChange(resizePayload)).toEqual({
      type: ACTION_TYPES.resizeChange,
      payload: resizePayload,
    });
  });
});
