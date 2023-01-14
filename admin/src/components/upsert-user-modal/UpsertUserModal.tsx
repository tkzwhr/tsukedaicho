import { CreateUserRequest, UpdateUserRequest } from '@/types/users.request';
import { User } from '@/types/users.response';
import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  user?: User;
  position: number;
  onCreated?: (param: CreateUserRequest) => void;
  onUpdated?: (param: UpdateUserRequest) => void;
  onClosed?: () => void;
}

export default function UpsertUserModal({
  open,
  user,
  position,
  onCreated,
  onUpdated,
  onClosed,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsValid(false);
    form.setFieldValue('name', user?.name);
    form.setFieldValue('slackId', user?.slackId);
  }, [open]);

  const upsert = () => {
    const name = form.getFieldValue('name');
    const slackId = form.getFieldValue('slackId');
    if (user) {
      onUpdated &&
        onUpdated({
          id: user.id,
          name,
          slackId: slackId?.length > 0 ? slackId : null,
          position: user.position,
        });
    } else {
      onCreated &&
        onCreated({
          name,
          slackId: slackId?.length > 0 ? slackId : null,
          position,
        });
    }
  };

  const validate = () => {
    const hasError = form
      .getFieldsError()
      .some((item) => item.errors.length > 0);
    setIsValid(!hasError);
  };

  return (
    <Modal
      open={open}
      title={user ? `${user.name}の編集` : `ユーザの追加`}
      cancelText="キャンセル"
      onCancel={onClosed}
      okText={user ? '更新' : '追加'}
      okButtonProps={{ disabled: !isValid }}
      onOk={upsert}
    >
      <Form form={form} layout="vertical" onFieldsChange={validate}>
        <Form.Item
          label="名前"
          name="name"
          rules={[{ required: true, message: '名前を入力してください' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Slack ID" name="slackId">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
