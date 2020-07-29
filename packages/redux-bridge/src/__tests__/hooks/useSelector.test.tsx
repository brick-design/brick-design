import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useSelector } from '../../hooks/useSelector'
import { LegoProvider, LegoProviderProps } from '../../components/LegoProvider'
import config from '../configs'
import { STATE_PROPS } from '@brickd/core'
import { overTarget } from '../../actions'

describe('useSelector', () => {
	it('测试没有controlUpdate', () => {
		const { result } = renderHook<LegoProviderProps, any>(
			() => useSelector<any, STATE_PROPS>(['hoverKey']),
			{
				// eslint-disable-next-line react/display-name
				wrapper: (props) => <LegoProvider {...props} config={config} />,
			},
		)

		act(() => {
			overTarget({ hoverKey: '1' })
		})
		act(() => {
			overTarget({ hoverKey: '1' })
		})

		expect(result.current).toEqual({ hoverKey: '1' })
	})
	it('测试有controlUpdate', () => {
		const { result } = renderHook<LegoProviderProps, any>(
			() => useSelector<any, STATE_PROPS>(['hoverKey'], () => false),
			{
				// eslint-disable-next-line react/display-name
				wrapper: (props) => <LegoProvider {...props} config={config} />,
			},
		)
		act(() => {
			overTarget({ hoverKey: '2' })
		})

		expect(result.current).toEqual({ hoverKey: '1' })
	})
})
