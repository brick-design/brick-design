import React, { forwardRef, memo, useEffect, useState } from 'react'
import { Col, InputNumber, Row } from 'antd'
import styles from './index.less'
import { EnumComponent } from '@brickd/react-web'
import { propsAreEqual } from '../../utils'

const UNITS = ['px', '%', 'em', 'rem']

const formatValue = (
	value: string | number,
	units: string[],
	hasUnit: boolean,
) => {
	if (!value || typeof value === 'number')
		return { formatNumber: value, formatUnit: 'px' }
	if (hasUnit) {
		const formatNumber = parseInt(value)
		return { formatNumber, formatUnit: value.split(`${formatNumber}`)[1] }
	} else {
		return { formatNumber: value }
	}
}

interface NumberComponentPropsType {
	units: string[]
	hasUnit: boolean
	numberSpan: number
	unitSpan: number
	value: string
	onChange: (value: any) => any
	size?: 'large' | 'small' | 'default'
	numberDisabled: boolean
}

function NumberComponent(props: NumberComponentPropsType) {
	const {
		units = UNITS,
		hasUnit = false,
		numberSpan = 13,
		value,
		unitSpan = 11,
		size,
		numberDisabled,
		onChange,
	} = props
	const { formatNumber, formatUnit = 'px' }: any = formatValue(
		value,
		units,
		hasUnit,
	)

	const [number, setNumber] = useState(formatNumber)
	const [unit, setUnit] = useState(formatUnit)
	const outputValue = hasUnit ? `${number}${unit}` : number

	useEffect(() => {
		const { formatNumber, formatUnit = 'px' }: any = formatValue(
			value,
			units,
			hasUnit,
		)
		setNumber(formatNumber)
		setUnit(formatUnit)
	}, [value, units, hasUnit,setNumber,setUnit])

	useEffect(() => {
		let timer = setTimeout(
			() => onChange && onChange(number && outputValue),
			100,
		)
		return () => clearTimeout(timer)
	}, [number, unit,onChange])

	return (
		<Row className={styles['number-unit-container']}>
			<Col span={numberSpan}>
				<InputNumber
					className={styles['input-num']}
					disabled={numberDisabled}
					value={number}
					size={size}
					onChange={(newNumber) => setNumber(newNumber)}
				/>
			</Col>
			{hasUnit && (
				<Col span={unitSpan}>
					<EnumComponent
						allowClear={false}
						value={unit}
						enumData={units}
						onChange={(newUnit) => setUnit(newUnit)}
					/>
				</Col>
			)}
		</Row>
	)
}

export default memo<NumberComponentPropsType>(
	forwardRef(NumberComponent),
	propsAreEqual,
)
