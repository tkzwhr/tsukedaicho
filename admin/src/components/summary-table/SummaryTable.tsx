import "./SummaryTable.scss";
import SummaryTableRow from "@/components/summary-table/SummaryTableRow";
import { TsukesResponse } from "@/types/tsukes.response";
import React from "react";
import { Icon, Loader, Message, Table } from "semantic-ui-react";

interface Props {
  loading: boolean;
  tsukes: TsukesResponse;
}

export default function SummaryTable({ loading, tsukes }: Props): JSX.Element {
  if (loading) {
    return (
      <Table celled definition collapsing>
        <Table.Body>
          <Table.Cell>
            <Loader
              className="loading-cell"
              active
              inline="centered"
              size="medium"
            >
              読み込み中...
            </Loader>
          </Table.Cell>
        </Table.Body>
      </Table>
    );
  }

  if (tsukes.isEmpty) {
    return (
      <Table celled definition collapsing>
        <Table.Body>
          <Table.Cell>
            <Message warning icon>
              <Icon name="warning circle" />
              <Message.Content>データが見つかりません</Message.Content>
            </Message>
          </Table.Cell>
        </Table.Body>
      </Table>
    );
  }

  const summaries = tsukes.summarize();

  return (
    <Table celled definition collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {summaries.map((s) => (
            <Table.HeaderCell key={s.name}>{s.name}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {summaries.map((s) => (
          <SummaryTableRow key={s.name} summary={s} />
        ))}
      </Table.Body>
    </Table>
  );
}
