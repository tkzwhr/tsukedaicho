import { ContextValues } from '@/providers/ServerConnectionProvider';
import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {
  contextValue: ContextValues;
  onUpdate: (values: ContextValues) => void;
};

export default function ServerConnectionSetting(props: Props): JSX.Element {
  const [form] = Form.useForm<ContextValues>();
  const [isValid, setIsValid] = useState(false);

  const validate = () => {
    const hasChanged =
      form.getFieldValue('endpoint') !== props.contextValue.endpoint ||
      form.getFieldValue('secret') !== props.contextValue.secret;
    const hasError = form
      .getFieldsError()
      .some((item) => item.errors.length > 0);
    setIsValid(hasChanged && !hasError);
  };

  useEffect(validate, [props.contextValue]);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={props.contextValue}
      requiredMark={false}
      onFieldsChange={validate}
      onFinish={props.onUpdate}
    >
      <Form.Item
        label="Hasura endpoint"
        name="endpoint"
        rules={[{ required: true, message: 'Please input Hasura endpoint' }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="Hasura admin secret"
        name="secret"
        rules={[
          { required: true, message: 'Please input Hasura admin secret' },
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!isValid}>
          設定
        </Button>
      </Form.Item>
    </Form>
  );
}
