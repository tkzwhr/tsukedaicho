import { GraphQLServerConnection } from '@/providers/GraphQLServerConnectionProvider';
import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {
  contextValue: GraphQLServerConnection;
  onUpdate: (values: GraphQLServerConnection) => void;
};

export default function ServerConnectionSetting({
  contextValue,
  onUpdate,
}: Props): JSX.Element {
  const [form] = Form.useForm<GraphQLServerConnection>();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    form.setFieldValue('endpoint', contextValue.endpoint);
    form.setFieldValue('secret', contextValue.secret);
  }, [contextValue]);

  const validate = () => {
    const hasChanged =
      form.getFieldValue('endpoint') !== contextValue.endpoint ||
      form.getFieldValue('secret') !== contextValue.secret;
    const hasError = form
      .getFieldsError()
      .some((item) => item.errors.length > 0);
    setIsValid(hasChanged && !hasError);
  };

  useEffect(validate, [contextValue]);

  return (
    <Form
      layout="vertical"
      form={form}
      requiredMark={false}
      onFieldsChange={validate}
      onFinish={onUpdate}
    >
      <Form.Item
        label="Hasura endpoint"
        name="endpoint"
        rules={[
          { required: true, message: 'Hasura endpointを入力してください' },
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="Hasura admin secret"
        name="secret"
        rules={[
          { required: true, message: 'Hasura admin secretを入力してください' },
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
