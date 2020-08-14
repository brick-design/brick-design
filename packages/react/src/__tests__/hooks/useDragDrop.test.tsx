import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { addComponent, getDropTarget, LEGO_BRIDGE, ROOT } from '@brickd/core';
import { REDUX_BRIDGE } from '@brickd/redux-bridge';
import config from '../configs';
import {
	DragDropStateType,
	DragDropTypes,
	useDragDrop,
} from '../../hooks/useDragDrop';
import BrickProvider from '../../components/BrickProvider';

afterEach(() => {
	LEGO_BRIDGE.config = undefined;
	LEGO_BRIDGE.store = null;
	REDUX_BRIDGE.store=null;
});
describe('useDragDrop', () => {
	it('当没有拖拽组件时', () => {
		const { result } = renderHook(() => useDragDrop(ROOT), {
			// eslint-disable-next-line react/display-name
			wrapper: (props) => <BrickProvider {...props} config={config} />,
		});
		const expectState: DragDropStateType = {
			dragSource: null,
			dropTarget: null,
			isHidden: false,
		};
		expect(result.current).toEqual(expectState);
	});

	describe('拖拽组件不是当前组件时,即dragKey!==key 触发addComponent添加组件action', () => {
		it('当拖拽组件drop的目标是其父组件时', () => {
			const initState: DragDropTypes = {
				dragSource: { dragKey: '1', parentKey: ROOT },
				dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
			};

			const { result } = renderHook(() => useDragDrop('2'), {
				// eslint-disable-next-line react/display-name
				wrapper: (props) => (
					<BrickProvider {...props} initState={initState} config={config} />
				),
			});

			act(() => {
				addComponent();
			});
			expect(result.current).toEqual({
				dragSource: null,
				dropTarget: null,
				isHidden: false,
			});
		});

		it('当拖拽组件drop的目标不是其父组件时', () => {
			const initState: DragDropTypes = {
				dragSource: { dragKey: '1', parentKey: ROOT },
				dropTarget: { selectedKey: '2', domTreeKeys: [] },
			};

			const { result } = renderHook(() => useDragDrop('3'), {
				// eslint-disable-next-line react/display-name
				wrapper: (props) => (
					<BrickProvider {...props} initState={initState} config={config} />
				),
			});
			act(() => {
				addComponent();
			});
			expect(result.current).toEqual({
				dragSource: null,
				dropTarget: null,
				isHidden: false,
			});
		});
	});
	describe('拖拽组件为当前组件时,即dragKey===key', () => {
		it('当拖拽组件drop的目标是其父组件时', () => {
			const initState: DragDropTypes = {
				dragSource: { dragKey: '1', parentKey: ROOT },
				dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
			};
			const { result } = renderHook(() => useDragDrop('1'), {
				// eslint-disable-next-line react/display-name
				wrapper: (props) => (
					<BrickProvider {...props} initState={initState} config={config} />
				),
			});
			act(() => {
				addComponent();
			});
			expect(result.current).toEqual({
				dragSource: null,
				dropTarget: null,
				isHidden: false,
			});
		});
		it('当拖拽组件drop的目标不是其父组件时', () => {
			const initState: DragDropTypes = {
				dragSource: { dragKey: '1', parentKey: '2' },
				dropTarget: { selectedKey: '2', domTreeKeys: [ROOT, '2'] },
			};
			const { result } = renderHook(() => useDragDrop('1'), {
				// eslint-disable-next-line react/display-name
				wrapper: (props) => (
					<BrickProvider {...props} initState={initState} config={config} />
				),
			});

			/**
			 * drop目标是父组件时
			 */
			expect(result.current).toEqual({ ...initState, isHidden: false });
			/**
			 * 更改drop目标为其他组件不是drag组件的父组件 并且domTreeKeys不包含parentKey
			 */
			const dropTarget2 = { selectedKey: '3', domTreeKeys: [ROOT, '3'] };
			act(() => {
				getDropTarget(dropTarget2);
			});
			expect(result.current).toEqual({
				...initState,
				dropTarget: dropTarget2,
				isHidden: true,
			});
			/**
			 * 更改drop目标为其他组件不是drag组件的父组件 但是domTreeKeys包含parentKey
			 */
			const dropTarget1 = { selectedKey: '4', domTreeKeys: [ROOT, '2', '4'] };
			act(() => {
				getDropTarget(dropTarget1);
			});
			expect(result.current).toEqual({
				...initState,
				dropTarget: dropTarget1,
				isHidden: false,
			});
		});
	});
});
