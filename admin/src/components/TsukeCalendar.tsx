import { Tsuke, TsukesResponse } from '@/types/tsukes.response';
import {
  Badge,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from 'antd';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { format } from 'date-fns';
import dateFnsGenerateConfig from 'rc-picker/es/generate/dateFns';
import React from 'react';

locale.lang.locale = 'ja';

const Calendar = generateCalendar<Date>(dateFnsGenerateConfig);

type Props = {
  loading: boolean;
  tsukes: TsukesResponse;
  selectAction: (date: Date) => void;
};

export default function TsukeCalendar({
  loading,
  tsukes,
  selectAction,
}: Props): JSX.Element {
  if (loading) {
    return (
      <Spin size="large">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Spin>
    );
  }

  if (!tsukes.all) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const dataByDay: Map<string, Tsuke[]> = tsukes.all.reduce((acc, v) => {
    const dateStr = format(v.date, 'yyyyMMdd');
    const item = acc.get(dateStr);
    if (item) {
      item.push(v);
    } else {
      acc.set(dateStr, [v]);
    }
    return acc;
  }, new Map());

  const dateCellRender = (date: Date) => {
    const dateStr = format(date, 'yyyyMMdd');
    const item = dataByDay.get(dateStr);
    if (!item) return null;
    return item.map((v) => (
      <Space key={v.id}>
        <Badge status="default" />
        {v.fromUser.name}
        <Typography.Text disabled>→</Typography.Text>
        {v.toUser.name}
        <Typography.Text type="secondary">¥{v.amount}</Typography.Text>
      </Space>
    ));
  };

  const dataByMonth: Map<string, number> = tsukes.all.reduce((acc, v) => {
    const dateStr = format(v.date, 'yyyyMM');
    const item = acc.get(dateStr);
    if (item) {
      acc.set(dateStr, item + 1);
    } else {
      acc.set(dateStr, 1);
    }
    return acc;
  }, new Map());

  const monthCellRender = (date: Date) => {
    const dateStr = format(date, 'yyyyMM');
    const item = dataByMonth.get(dateStr);
    if (!item) return null;
    return (
      <Row justify="center">
        <Col>
          <Statistic value={item} />
        </Col>
      </Row>
    );
  };

  return (
    <Calendar
      locale={locale}
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
      onSelect={selectAction}
    />
  );
}
