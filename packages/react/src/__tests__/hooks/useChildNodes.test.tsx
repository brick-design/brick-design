import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { LEGO_BRIDGE, ROOT, StateType } from '@brickd/core'
import { useChildNodes, UseChildNodeType } from '../../hooks/useChildNodes'
import BrickProvider from '../../components/BrickProvider'
import config from '../configs'
import { REDUX_BRIDGE } from '@brickd/redux-bridge'

afterEach(() => {
	LEGO_BRIDGE.config = undefined
	LEGO_BRIDGE.store = null
	REDUX_BRIDGE.store=null

})
describe('useChildNodes', () => {
	it('childNodes===undefined', () => {
		const mockData: UseChildNodeType = {
			specialProps: { key: ROOT, parentKey: '', domTreeKeys: [ROOT] },
			componentName: 'span',
		}
		renderHook(() => useChildNodes(mockData), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => <BrickProvider {...props} config={config} />,
		})

		// expect(result.current)
	})

	it('childNodes is array and isRequired', () => {
		const mockData: UseChildNodeType = {
			specialProps: { key: ROOT, parentKey: '', domTreeKeys: [ROOT] },
			componentName: 'h',
			childNodes: [],
		}

		const initState: Partial<StateType> = {
			componentConfigs: {
				[ROOT]: {
					componentName: 'h',
				},
			},
		}

		renderHook(() => useChildNodes(mockData), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => (
				<BrickProvider {...props} initState={initState} config={config} />
			),
		})

		// expect(result.current)
	})

	it('childNodes is object and isRequired', () => {
		const mockData: UseChildNodeType = {
			specialProps: { key: ROOT, parentKey: '', domTreeKeys: [ROOT] },
			componentName: 'span',
			childNodes: {
				children: [],
				test: [],
			},
		}
		const initState: Partial<StateType> = {
			componentConfigs: {
				[ROOT]: {
					componentName: 'span',
				},
			},
		}

		renderHook(() => useChildNodes(mockData), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => (
				<BrickProvider {...props} initState={initState} config={config} />
			),
		})

		// expect(result.current)
	})

	it('childNodes is array', () => {
		const mockData: UseChildNodeType = {
			specialProps: { key: ROOT, parentKey: '', domTreeKeys: [ROOT] },
			componentName: 'a',
			childNodes: ['1'],
		}

		renderHook(() => useChildNodes(mockData), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => <BrickProvider {...props} config={config} />,
		})

		// expect(result.current)
	})
	it('childNodes is object', () => {
		const mockData: UseChildNodeType = {
			specialProps: { key: ROOT, parentKey: '', domTreeKeys: [ROOT] },
			componentName: 'span',
			childNodes: {
				children: ['1'],
				test: [],
			},
		}

		renderHook(() => useChildNodes(mockData), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => <BrickProvider {...props} config={config} />,
		})

		// expect(result.current)
	})
})
