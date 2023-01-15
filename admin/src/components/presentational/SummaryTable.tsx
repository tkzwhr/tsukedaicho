import { TsukesResponse } from '@/types/tsukes.response';
import { Table, Typography, Badge, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

type Props = {
  loading: boolean;
  tsukes: TsukesResponse;
};

type UserDataType = {
  [id: number]: number;
};

type DataType = {
  key: number;
  name: string;
} & UserDataType;

const initialColumns: ColumnsType<DataType> = [
  {
    title: '名前',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
  },
];

export default function SummaryTable({ loading, tsukes }: Props): JSX.Element {
  if (loading || tsukes.isEmpty) {
    return (
      <Table
        columns={initialColumns}
        loading={loading}
        pagination={false}
        size="small"
        bordered
        scroll={{ x: 400, y: 400 }}
      />
    );
  }

  const summaries = tsukes.summarize();

  const data: DataType[] = summaries.map((s) => {
    const result: DataType = {
      key: s.id,
      name: s.name,
    };
    return s.columns.reduce((acc, v) => {
      return {
        ...acc,
        [v.id]: v.amount,
      };
    }, result);
  });

  const usersColumns: ColumnsType<DataType> = data.map((d, i) => ({
    title: d.name,
    dataIndex: d.key,
    render: (value, record, j) => {
      if (i === j) return <Typography.Text disabled>-</Typography.Text>;

      if (value === 0)
        return (
          <Space>
            <Badge status="default" />
            <Typography.Text disabled>0円</Typography.Text>
          </Space>
        );

      if (value < 0)
        return (
          <Space>
            <Badge status="error" />
            <Typography.Text type="danger">{-value}円</Typography.Text>
          </Space>
        );

      return (
        <Space>
          <Badge color="blue" />
          <Typography.Text>{value}円</Typography.Text>
        </Space>
      );
    },
  }));
  const columns = [...initialColumns, ...usersColumns];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
      bordered
      scroll={{ x: 400, y: 1000 }}
    />
  );
}
