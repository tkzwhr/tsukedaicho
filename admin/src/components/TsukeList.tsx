import { Tsuke } from '@/types/tsukes.response';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm, Space, Typography } from 'antd';
import { format } from 'date-fns';
import React from 'react';

type Props = {
  date: Date;
  tsukes: Tsuke[];
  editAction: (target: Tsuke) => void;
  deleteAction: (target: Tsuke) => void;
};

export default function TsukeList({
  date,
  tsukes,
  editAction,
  deleteAction,
}: Props): JSX.Element {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tsukes}
      header={
        <Typography.Title level={5}>
          {format(date, 'yyyy/M/d')}
        </Typography.Title>
      }
      style={{ minWidth: '400px' }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              key="edit"
              icon={<EditOutlined />}
              onClick={() => editAction(item)}
            />,
            <Popconfirm
              key="delete"
              title="ツケを削除します"
              description="本当に削除してもよろしいですか？この操作は取り消せません。"
              cancelText="キャンセル"
              okText="削除する"
              okType="danger"
              onConfirm={() => deleteAction(item)}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={
              <Space>
                <Typography.Text>{item.fromUser.name}</Typography.Text>
                <Typography.Text type="secondary">→</Typography.Text>
                <Typography.Text>{item.toUser.name}</Typography.Text>
              </Space>
            }
            description={
              <p>
                {item.amount}円<br />
                {item.description}
              </p>
            }
          />
        </List.Item>
      )}
    />
  );
}
