import React, { forwardRef, memo, useState } from 'react'
import map from 'lodash/map'
import { Button, Col, Dropdown, Row, TreeSelect } from 'antd'
import classNames from 'classnames'
import styles from './index.less'
import options from './config'
import { propsAreEqual } from '../../../utils'

const { TreeNode } = TreeSelect

interface AnimatePropsType {
	value: string
	onChange: (value: any) => void
}

function Animate(props: AnimatePropsType, ref: any) {
	const { value, onChange } = props
	const [dropdownVisible, setDropdownVisible] = useState(false)

	function handleChange(val: any) {
		let animatedClass = val ? `${val} animated` : undefined
		onChange && onChange(animatedClass)
	}

	function renderAnimateBox(animateName: string) {
		const animateClass = animateName ? `${animateName} animated` : ''

		return (
			<div className={styles['animate-wrap']}>
				{/* //这里一定要加上key
            //className是animate.css中的类名，显示不同动画 */}
				<div
					key="amache"
					className={classNames(styles['animate-box'], animateClass)}
				>
					Animate
				</div>
			</div>
		)
	}

	return (
		<Row gutter={10} className={styles['animate-component-warp']}>
			<Col style={{ lineHeight: 0 }} span={14}>
				<TreeSelect
					showSearch
					value={value ? value.split(' ')[0] : ''}
					style={{ width: '100%' }}
					dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
					placeholder="请选择"
					allowClear
					treeDefaultExpandAll
					dropdownMatchSelectWidth
					className={styles['select-box']}
					onChange={handleChange}
				>
					{map(options, (optGroup) => (
						<TreeNode
							value={optGroup.title}
							title={optGroup.title}
							key={optGroup.title}
							disabled
						>
							{map(optGroup.data, (option) => (
								<TreeNode value={option} title={option} key={option} />
							))}
						</TreeNode>
					))}
				</TreeSelect>
			</Col>
			<Col
				style={{ lineHeight: 0, position: 'relative' }}
				span={10}
				id="drop-down"
			>
				<Dropdown
					visible={dropdownVisible}
					getPopupContainer={(triggerNode: any) => triggerNode}
					overlay={renderAnimateBox(value ? value.split(' ')[0] : '')}
					placement="bottomRight"
				>
					<Button
						size={'small'}
						className={styles['animate-btn']}
						onClick={() => setDropdownVisible(!dropdownVisible)}
					>
						Animate It
					</Button>
				</Dropdown>
			</Col>
		</Row>
	)
}

export default memo(forwardRef(Animate), propsAreEqual)
