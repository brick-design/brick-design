import { reducer } from '../../reducers'
import ACTION_TYPES from '../../actions/actionTypes'
import { legoState } from '../../store'
import { ComponentConfigsType, SelectedInfoType, StateType } from '../../types';

describe('changeStyle', () => {
	const action={type: ACTION_TYPES.changeStyles}
	test('selectedInfo=null', () => {
		const state = reducer(legoState, {
			...action,
			payload: { style: {} },
		})
		expect(state).toBe(legoState)
	})
	test('props===undefined', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root'],
				parentKey: '',
				propsConfig:{}
			},
			componentConfigs: {
				root: {
					componentName: 'img'
				},
			},
		}
		const state = reducer(prevState, {
			...action,
			payload: { style: {} },
		})
		expect(state.componentConfigs.root.props).toEqual({ style: {} })
	})
	test('props!==undefined', () => {
		const prevState: StateType = {
			...legoState,
			selectedInfo: {
				selectedKey: 'root',
				domTreeKeys: ['root'],
				parentKey: '',
				propsConfig:{}
			},
			componentConfigs: {
				root: {
					componentName: 'img',
					props:{}
				},
			},
		}
		const state = reducer(prevState, {
			...action,
			payload: { style: {} },
		})
		expect(state.componentConfigs.root.props).toEqual({ style: {} })
	})
})
describe('resetStyle',()=>{
	const action={type:ACTION_TYPES.resetStyles}
	it('selectedInfo===null',()=>{
		expect(reducer(legoState,action)).toBe(legoState)
	})

	it('重置样式 props===undefined',()=>{
		const selectedInfo:SelectedInfoType={
			selectedKey:"root",
			propsConfig:{},
			domTreeKeys:[],
			parentKey:''
		}
		const componentConfigs:ComponentConfigsType={
			root:{componentName:'a',props:{style:{a:1}}}
		}
		const prevState:StateType={
			...legoState,
			undo:[],
			selectedInfo,
			componentConfigs

		}
		const state=reducer(prevState,action)
		const expectState:StateType={
			...prevState,
			undo:[{componentConfigs}],
			componentConfigs:{
				root:{
					componentName:'a',
					props:{}
				}
			}
		}
		expect(state).toEqual(expectState)
	})
	it('重置样式 prop!==undefined',()=>{
		const selectedInfo:SelectedInfoType={
			selectedKey:"root",
			propsConfig:{},
			domTreeKeys:[],
			props:{},
			parentKey:''
		}
		const componentConfigs:ComponentConfigsType={
			root:{componentName:'a',props:{style:{a:1}}}
		}
		const prevState:StateType={
			...legoState,
			undo:[],
			selectedInfo,
			componentConfigs

		}
		const state=reducer(prevState,action)
		const expectState:StateType={
			...prevState,
			undo:[{componentConfigs}],
			componentConfigs:{
				root:{
					componentName:'a',
					props:{}
				}
			}
		}
		expect(state).toEqual(expectState)
	})
})
