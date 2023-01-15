import { SummaryColumn, SummaryRow } from '@/types/summary';
import React from 'react';
import { Icon, Table } from 'semantic-ui-react';

type Props = {
  summary: SummaryRow;
};

export default function SummaryTableRow({ summary }: Props): JSX.Element {
  function createCell(summaryColumn: SummaryColumn): JSX.Element {
    if (summary.name === summaryColumn.name) {
      return <Table.Cell key={summaryColumn.name} active />;
    }
    if (summaryColumn.amount > 0) {
      return (
        <Table.Cell key={summaryColumn.name} positive>
          <Icon name="arrow alternate circle up outline" />
          {summaryColumn.amount}円
        </Table.Cell>
      );
    }
    if (summaryColumn.amount < 0) {
      return (
        <Table.Cell key={summaryColumn.name} negative>
          <Icon name="arrow alternate circle down" />
          {summaryColumn.amount}円
        </Table.Cell>
      );
    }
    return <Table.Cell key={summaryColumn.name}>0円</Table.Cell>;
  }

  return (
    <Table.Row>
      <Table.Cell>{summary.name}</Table.Cell>
      {summary.columns.map(createCell)}
    </Table.Row>
  );
}
