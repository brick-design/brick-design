import {
	addComponent,
	addPropsConfig,
	AddPropsConfigInfo,
	changePlatform,
	clearChildNodes,
	clearHovered,
	copyComponent,
	deleteComponent,
	deletePropsConfig,
	DeletePropsConfigPayload,
	DragSourcePayload,
	DropTargetPayload,
	getDragSource,
	getDropTarget,
	LayoutSortPayload,
	onLayoutSortChange,
	overTarget,
	OverTargetPayload,
	redo,
	submitProps,
	SubmitPropsPayload,
	undo,
	selectComponent,
	SelectComponentPayload,
	clearSelectedStatus, stylePayload, changeStyles,
} from '../../actions';
import ACTION_TYPES from '../../actions/actionTypes'
import { PlatformInfoType } from '../../types';

describe('actions test', () => {
	test('test actions', () => {
		// componentConfig
		expect(addComponent()).toEqual({ type: ACTION_TYPES.addComponent })
		expect(copyComponent()).toEqual({ type: ACTION_TYPES.copyComponent })
		const payload:LayoutSortPayload={sortKeys:[],parentKey:''}
		expect(onLayoutSortChange(payload)).toEqual({ type: ACTION_TYPES.onLayoutSortChange,payload })
		expect(deleteComponent()).toEqual({ type: ACTION_TYPES.deleteComponent })
		expect(clearChildNodes()).toEqual({ type: ACTION_TYPES.clearChildNodes })
		//dragDrop
		const dragPayload:DragSourcePayload={dragKey:'',parentKey:''}
		expect(getDragSource(dragPayload)).toEqual({ type: ACTION_TYPES.getDragSource,payload:dragPayload })
		const dropPayload:DropTargetPayload={selectedKey:'',domTreeKeys:[],}
		expect(getDropTarget(dropPayload)).toEqual({ type: ACTION_TYPES.getDropTarget,payload:dropPayload })
		//hover
		const hoverPayload:OverTargetPayload={hoverKey:''}
		expect(overTarget(hoverPayload)).toEqual({ type: ACTION_TYPES.overTarget,payload:hoverPayload })
		expect(clearHovered()).toEqual({ type: ACTION_TYPES.clearHovered })
		//platform
		const changePlatformPayload:PlatformInfoType={size:[],isMobile:true}
		expect(changePlatform(changePlatformPayload)).toEqual({ type: ACTION_TYPES.changePlatform,payload:changePlatformPayload })
		//props
		const addPropsConfigPayload:AddPropsConfigInfo={fatherFieldLocation:''}
		expect(addPropsConfig(addPropsConfigPayload)).toEqual({type:ACTION_TYPES.addPropsConfig,payload:addPropsConfigPayload})
		const deletePropsConfigPayload:DeletePropsConfigPayload={fatherFieldLocation:'',field:''}
		expect(deletePropsConfig(deletePropsConfigPayload)).toEqual({type:ACTION_TYPES.deletePropsConfig,payload:deletePropsConfigPayload})
		const submitPropsPayload:SubmitPropsPayload={props:{}}
		expect(submitProps(submitPropsPayload)).toEqual({type:ACTION_TYPES.submitProps,payload:submitPropsPayload})
		//redoUndo
		expect(redo()).toEqual({ type: ACTION_TYPES.redo })
		expect(undo()).toEqual({ type: ACTION_TYPES.undo })
		//selectedComponent
		const selectComponentPayload:SelectComponentPayload={domTreeKeys:[],key:'',parentKey:''}
		expect(selectComponent(selectComponentPayload)).toEqual({ type: ACTION_TYPES.selectComponent,payload:selectComponentPayload })
		expect(clearSelectedStatus()).toEqual({type:ACTION_TYPES.clearSelectedStatus})
		//styles
		const changeStylePayload:stylePayload={style:{}}
		expect(changeStyles(changeStylePayload)).toEqual({type:ACTION_TYPES.changeStyles,payload:changeStylePayload})
	})
})
