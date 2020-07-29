import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Input, Spin } from 'antd'
import { DefaultImgBase64 } from '../config'
import html2canvas from 'html2canvas'
import { FormComponentProps } from 'antd/lib/form'

const { Item } = Form

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
}

const formButtonLayout = {
	wrapperCol: {
		xs: { span: 24, offset: 0 },
		sm: { span: 16, offset: 8 },
	},
}

interface GenerateTemplatePropsType extends FormComponentProps {
	uploadFile?: any
}

function GenerateTemplate(props: GenerateTemplatePropsType) {
	const [srcImg, setSrcImg] = useState(DefaultImgBase64)
	const [spinning, setSpinning] = useState(false)
	const {
		form: { getFieldDecorator, validateFields },
		uploadFile,
	} = props

	useEffect(() => {
		const iframe: any = document.getElementById('dnd-iframe')
		const testDom = iframe.contentDocument.getElementById('select-img')
		if (!testDom) return
		setSpinning(true)
		html2canvas(testDom).then((img) => {
			setSpinning(false)
			setSrcImg(img.toDataURL())
		})
	}, [])

	const submit = useCallback(
		(e: any) => {
			e.preventDefault()
			validateFields((err, fieldsValue) => {
				if (err) {
					return
				}
				const { templateName } = fieldsValue
				uploadFile && uploadFile({ templateName, srcImg })
			})
		},
		[srcImg],
	)

	return (
		<Form>
			<Item {...formItemLayout} label={'模板名字'}>
				{getFieldDecorator('templateName', {
					rules: [{ required: true, message: '模板名不能为空' }],
				})(<Input />)}
			</Item>
			<Item label="图片" {...formItemLayout}>
				<Spin spinning={spinning}>
					<img style={{ width: '100%', height: 200 }} src={srcImg} />
				</Spin>
			</Item>
			<Item {...formButtonLayout}>
				<Button type="primary" onClick={submit}>
					提交
				</Button>
			</Item>
		</Form>
	)
}

export default Form.create<GenerateTemplatePropsType>()(GenerateTemplate)
