import { Direction } from '@/types/enums';
import { User, UsersResponse } from '@/types/users.response';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

type Props = {
  loading: boolean;
  users: UsersResponse;
  editAction: (user: User) => void;
  deleteAction: (user: User) => void;
  moveAction: (target: User, direction: Direction) => void;
};

type DataType = {
  key: string;
  name: string;
  slackId?: string;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMove: (dir: Direction) => void;
  onDelete: () => void;
};

const columns: ColumnsType<DataType> = [
  {
    title: '名前',
    dataIndex: 'name',
  },
  {
    title: 'Slack ID',
    dataIndex: 'slackId',
  },
  {
    title: 'Action',
    key: 'action',
    align: 'right',
    render: (_: any, record: DataType) => (
      <Space.Compact>
        <Button icon={<EditOutlined />} onClick={record.onEdit} />
        <Button
          icon={<CaretUpOutlined />}
          disabled={record.isFirst}
          onClick={() => record.onMove('upward')}
        />
        <Button
          icon={<CaretDownOutlined />}
          disabled={record.isLast}
          onClick={() => record.onMove('downward')}
        />
        <Popconfirm
          title="ユーザーを削除します"
          description="本当に削除してもよろしいですか？この操作は取り消せません。"
          cancelText="キャンセル"
          okText="削除する"
          okType="danger"
          onConfirm={record.onDelete}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space.Compact>
    ),
  },
];

export default function UserTable({
  loading,
  users,
  editAction,
  deleteAction,
  moveAction,
}: Props): JSX.Element {
  if (loading || !users.all) {
    return (
      <Table
        columns={columns}
        loading={loading}
        pagination={false}
        size="small"
      />
    );
  }

  const data: DataType[] = users.all.map((u) => ({
    key: u.id.toString(),
    name: u.name,
    slackId: u.slackId,
    isFirst: u.position === 1,
    isLast: u.position === users.allCount,
    onEdit: () => editAction(u),
    onMove: (dir) => moveAction(u, dir),
    onDelete: () => deleteAction(u),
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
    />
  );
}
