import React, {
	createElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { Col, Icon, Row, Tooltip } from 'antd'
import map from 'lodash/map'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import isString from 'lodash/isString'
import menus, { CONTEXT_MENU, ENABLED } from './config'
import styles from './style.less'

import { redo, undo, useSelector } from '@brickd/react'

const REST_STYLE = 'resetStyle'
const UNDO = 'undo'
const REDO = 'redo'
const CLEAR = 'clear'

function renderMenu(
	config: any,
	key: string,
	enabled: string[],
	funMap: any,
	style: any,
) {
	const { title, icon, shortcutKey, props = {}, type } = config
	if (!isString(icon)) return createElement(icon, { key, ...props })
	const disabledColor = '#A4A4A4'
	const enabledColor = '#000'
	const isEnabled = enabled.includes(title)
	let func = undefined
	if (isEnabled) {
		func = funMap[title] || type
	}
	return (
		<Tooltip key={key} mouseEnterDelay={1} title={shortcutKey}>
			<div
				style={{ color: isEnabled ? enabledColor : disabledColor }}
				className={styles['icon-container']}
				onClick={func}
				key={key}
			>
				<Icon style={{ fontSize: 18 }} type={icon} />
				<span>{title}</span>
			</div>
		</Tooltip>
	)
}

function renderGroup(
	content: any,
	key: string,
	enabled: string[],
	funMap: any,
	resetStyle: any,
) {
	const { span, group, style = {} } = content
	return (
		<Col span={span} key={key}>
			<div style={{ display: 'flex', flex: 1, ...style }}>
				{map(group, (config: any, k: string) =>
					renderMenu(config, k, enabled, funMap, resetStyle),
				)}
			</div>
		</Col>
	)
}

function onKeyDown(keyEvent: any, enabled: string[]) {
	const { key, ctrlKey, shiftKey, metaKey } = keyEvent
	if (key === 'z' && (ctrlKey || metaKey)) {
		if (!shiftKey && enabled.includes(UNDO)) {
			undo()
		} else if (shiftKey && enabled.includes(REDO)) {
			redo()
		}
	}
}

function ToolBar() {
	const {
		selectedInfo,
		pageConfig,
		undo,
		redo,
		styleSetting,
		platformInfo,
	} = useSelector([
		'selectedInfo',
		'pageConfig',
		'undo',
		'redo',
		'styleSetting',
		'platformInfo',
	])

	const { style, isContainer, location } = selectedInfo || {}

	const [visible, setVisible] = useState(false)
	const [isShowTemplate, setIsShowTemplate] = useState(false)

	const enabled: string[] = []

	/**
	 * 键盘监听 实现快捷键操作
	 */
	useEffect(() => {
		const keyListener = (e: any) => onKeyDown(e, enabled)
		window.addEventListener('keydown', keyListener)
		return () => window.removeEventListener('keydown', keyListener)
	}, [enabled])

	if (style && !isEqual(style, styleSetting)) enabled.push(REST_STYLE)
	if (isContainer) enabled.push(CLEAR)
	if (!isEmpty(undo)) enabled.push(UNDO)
	if (!isEmpty(redo)) enabled.push(REDO)
	if (isEmpty(selectedInfo)) {
		enabled.push(...ENABLED.must)
	} else if (!isEmpty(pageConfig)) {
		enabled.push(...ENABLED.must, ...ENABLED.selected)
	}

	/**
	 * 生成复合组件
	 *
	 */
	const generateTemplate = useCallback(() => {
		// if (handleRequiredHasChild(selectedInfo!, pageConfig!)) return;
		setVisible(true)
		setIsShowTemplate(true)
	}, [])

	/**
	 *  本方式是生成复合组件事件
	 *  data   请求de参数
	 */

	const addTemplateInfo = useCallback(
		(data: any) => {
			const { templateName, srcImg } = data
			const currentComponentInfo = get(pageConfig, location!, {})
			if (!isEmpty(currentComponentInfo)) {
				// dispatch!({
				//   type: ACTION_TYPES.addTemplateInfo,
				//   payload: {
				//     img: srcImg,
				//     name: templateName,
				//     config: JSON.stringify(currentComponentInfo),
				//   },
				// });
			}
			setVisible(false)
		},
		[location, pageConfig],
	)

	/**
	 * 页面预览
	 * @returns {*}
	 */

	const preview = useCallback(() => {
		// if (handleRequiredHasChild(selectedInfo!, pageConfig!)) return;
		setVisible(true)
		setIsShowTemplate(false)
	}, [])

	const funMap: { [funName: string]: () => any } = {
		preview,
		generateTemplate,
	}

	const modalConfig = isShowTemplate
		? {
				title: '生成模板',
				closable: true,
				footer: null,
				onCancel: () => setVisible(!visible),
		  }
		: {
				width: '100%',
				bodyStyle: {
					padding: 0,
					overflow: 'hidden',
					height: '100vh',
				},
				footer: null,
				closable: false,
				wrapClassName: styles['full-screen'],
		  }
	return (
		<>
			<Row
				type="flex"
				justify="space-around"
				align="middle"
				className={styles.content}
			>
				<Col style={{ fontSize: '16px', paddingLeft: '21px' }} span={3}>
					Brick Design
				</Col>
				<Col span={21}>
					<Row>
						{useMemo(
							() =>
								map(menus, (content: any, key: string) =>
									renderGroup(content, key, enabled, funMap, style),
								),
							[enabled, funMap, style],
						)}
					</Row>
				</Col>
				{/*<Modal*/}
				{/*  visible={visible}*/}
				{/*  destroyOnClose*/}
				{/*  {...modalConfig}*/}
				{/*>*/}
				{/*  {isShowTemplate ? <GenerateTemplate uploadFile={addTemplateInfo}/> :*/}
				{/*    <PreviewAndCode pageConfig={pageConfig!}*/}
				{/*                    controlModal={() => setVisible(false)}*/}
				{/*                    visible={visible}*/}
				{/*                    platformInfo={platformInfo}*/}
				{/*    />}*/}
				{/*</Modal>*/}
			</Row>
		</>
	)
}

export default ToolBar
