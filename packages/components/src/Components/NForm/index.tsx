import React, { forwardRef, memo } from 'react';
import Form, { FormProps } from 'rc-field-form';
import { map } from 'lodash';
import FormItem, { FormItemProps } from './FormItem';

export interface NFormProps extends FormProps, Omit<FormItemProps, 'config'> {
  formConfig: any;
}

function NForm(props: NFormProps,ref:any) {
  const { formConfig, renderFormItem, isShowLabel, ...rest } = props;
  return (
    <Form {...rest} ref={ref}>
      {map(formConfig, (config, key) => (
        <FormItem
          isShowLabel={isShowLabel}
          renderFormItem={renderFormItem}
          config={config}
          key={key}
          name={key}
        />
      ))}
    </Form>
  );
}

export default memo(forwardRef(NForm));
