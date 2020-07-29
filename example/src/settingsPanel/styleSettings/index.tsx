import React, { createElement, useCallback, useState } from 'react'
import { Col, Collapse, Form, Icon, Row, Tooltip } from 'antd'
import map from 'lodash/map'
import each from 'lodash/each'
import get from 'lodash/get'
import cssConfig from './styleConfigs'
import styleSheet from './index.less'
import { CSS_TYPE_TO_COMPONENT } from './config'
import { FormComponentProps } from 'antd/lib/form'
import { changeStyles } from '@brickd/react'

const FormItem = Form.Item
const { Panel } = Collapse

interface StyleSettingsPropsType extends FormComponentProps {
	styleSetting?: any
}

function StyleSettings(props: StyleSettingsPropsType) {
	const {
		form: { getFieldDecorator },
	} = props
	const [openKeys, setOpenKeys] = useState<string | string[]>(
		map(cssConfig, (_, key) => key),
	)

	/**
	 * 折叠触发器
	 * @param openKeys
	 */

	const renderHeader = useCallback((key: string, isFold: boolean) => {
		return (
			<div className={styleSheet['fold-header']}>
				<span>{key}</span>
				<Icon
					className={isFold ? styleSheet.rotate180 : ''}
					style={{ marginLeft: '5px', transition: 'all 0.2s' }}
					type="caret-up"
				/>
			</div>
		)
	}, [])

	function renderColItem(config: any, field: string) {
		const {
			label,
			tip = '',
			labelPlace = 'left',
			span = 6,
			type,
			labelSpan = 4,
			valueSpan = 20,
			props = { size: 'small' },
		} = config
		return (
			<Col span={span} key={field}>
				<FormItem>
					<Row type="flex" justify="space-around" align="middle">
						{labelPlace === 'left' && (
							<Col style={{ fontSize: 12 }} span={labelSpan}>
								<Tooltip title={tip || field}>{label}</Tooltip>
							</Col>
						)}
						<Col span={valueSpan}>
							{getFieldDecorator(
								field,
								{},
							)(createElement(get(CSS_TYPE_TO_COMPONENT, type), props))}
							{labelPlace === 'bottom' && (
								<div className={styleSheet['bottom-label']}>
									<Tooltip placement="bottom" title={tip || field}>
										{label}
									</Tooltip>
								</div>
							)}
						</Col>
						<Col span={24 - labelSpan - valueSpan} />
					</Row>
				</FormItem>
			</Col>
		)
	}

	function renderFormItem(styles: any, key: string) {
		return (
			<Panel
				showArrow={false}
				className={styleSheet['panel-border']}
				header={renderHeader(key, openKeys.includes(key))}
				key={key}
			>
				<Row gutter={10}>{map(styles, renderColItem)}</Row>
			</Panel>
		)
	}

	return (
		<Form className={styleSheet['form-container']}>
			<Collapse
				activeKey={openKeys}
				style={{ margin: 0, backgroundColor: '#0000' }}
				bordered={false}
				onChange={(changeOpenKeys) => setOpenKeys(changeOpenKeys)}
			>
				{map(cssConfig, renderFormItem)}
			</Collapse>
		</Form>
	)
}

export default Form.create<StyleSettingsPropsType>({
	mapPropsToFields(props) {
		const { styleSetting } = props
		const formatFields: any = {}
		each(
			styleSetting,
			(v, field) => (formatFields[field] = Form.createFormField({ value: v })),
		)
		return formatFields
	},
	onValuesChange: (props, _, allValues) => {
		const style: any = {}
		each(allValues, (v, k) => {
			if (v !== undefined) style[k] = v
		})
		changeStyles({
			style,
		})
	},
})(StyleSettings)
