import { CreateTsukeRequest, UpdateTsukeRequest } from '@/types/tsukes.request';
import { Tsuke } from '@/types/tsukes.response';
import { UsersResponse } from '@/types/users.response';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import generatePicker from 'antd/es/date-picker/generatePicker';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { addHours } from 'date-fns';
import dateFnsGenerateConfig from 'rc-picker/es/generate/dateFns';
import React, { useEffect, useMemo, useState } from 'react';

locale.lang.locale = 'ja';

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

type Props = {
  open: boolean;
  tsuke?: Tsuke;
  date?: Date;
  users: UsersResponse;
  onCreated?: (param: CreateTsukeRequest) => void;
  onUpdated?: (param: UpdateTsukeRequest) => void;
  onClosed?: () => void;
};

export default function UpsertTsukeModal({
  open,
  tsuke,
  date,
  users,
  onCreated,
  onUpdated,
  onClosed,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const userOptions = useMemo(
    () => users.all.map((u) => ({ value: u.id, label: u.name })),
    [users],
  );

  useEffect(() => {
    if (!open) return;
    setIsValid(false);
    form.setFieldValue('date', tsuke?.date ?? date ?? new Date());
    form.setFieldValue('fromUserId', tsuke?.fromUser.id);
    form.setFieldValue('toUserId', tsuke?.toUser.id);
    form.setFieldValue('amount', tsuke?.amount);
    form.setFieldValue('description', tsuke?.description);
  }, [open]);

  function upsert() {
    const date: Date = form.getFieldValue('date');
    const dateJst = addHours(date, 9);
    const fromUserId = form.getFieldValue('fromUserId');
    const toUserId = form.getFieldValue('toUserId');
    const amount = form.getFieldValue('amount');
    const description = form.getFieldValue('description');
    if (tsuke) {
      onUpdated &&
        onUpdated({
          id: tsuke.id,
          date: dateJst,
          fromUserId,
          toUserId,
          amount,
          description,
        });
    } else {
      onCreated &&
        onCreated({
          date: dateJst,
          fromUserId,
          toUserId,
          amount,
          description,
        });
    }
  }

  const validate = () => {
    const hasError = form
      .getFieldsError()
      .some((item) => item.errors.length > 0);
    setIsValid(!hasError);
  };

  const userValidator = async () => {
    const fromUserId = form.getFieldValue('fromUserId');
    const toUserId = form.getFieldValue('toUserId');
    return fromUserId === toUserId ? Promise.reject() : Promise.resolve();
  };

  return (
    <Modal
      open={open}
      title={tsuke ? `ツケの編集` : `ツケの追加`}
      cancelText="キャンセル"
      onCancel={onClosed}
      okText={tsuke ? '更新' : '追加'}
      okButtonProps={{ disabled: !isValid }}
      onOk={() =>
        form
          .validateFields()
          .then(upsert)
          .catch(() => {})
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFieldsChange={validate}
      >
        <Form.Item
          label="日付"
          name="date"
          rules={[{ required: true, message: '日付を選択してください' }]}
        >
          <DatePicker locale={locale} onChange={() => {}} />
        </Form.Item>
        <Form.Item
          label="貸したユーザー"
          name="fromUserId"
          rules={[
            { required: true, message: '貸したユーザーを選択してください' },
            {
              validator: userValidator,
              message: '借りたユーザーと同じユーザーは選択できません',
            },
          ]}
        >
          <Select options={userOptions} />
        </Form.Item>
        <Form.Item
          label="借りたユーザー"
          name="toUserId"
          rules={[
            { required: true, message: '借りたユーザーを選択してください' },
            {
              validator: userValidator,
              message: '貸したユーザーと同じユーザーは選択できません',
            },
          ]}
        >
          <Select options={userOptions} />
        </Form.Item>
        <Form.Item
          label="金額"
          name="amount"
          rules={[{ required: true, message: '金額を入力してください' }]}
        >
          <InputNumber
            formatter={(value) => `¥ ${value}`}
            parser={(value) => value!.replace('¥ ', '')}
          />
        </Form.Item>
        <Form.Item
          label="摘要"
          name="description"
          rules={[{ required: true, message: '摘要を入力してください' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
