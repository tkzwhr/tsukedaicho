import "./TsukeTable.scss";
import TsukeTableRow from "@/components/tsuke-table/TsukeTableRow";
import { Tsuke, TsukesResponse } from "@/types/tsukes.response";
import React from "react";
import { Icon, Loader, Message, Table } from "semantic-ui-react";

interface Props {
  loading: boolean;
  tsukes: TsukesResponse;
  editAction: (target: Tsuke) => void;
  deleteAction: (target: Tsuke) => void;
}

export default function TsukeTable({
  loading,
  tsukes,
  editAction,
  deleteAction,
}: Props): JSX.Element {
  const tableRows = (() => {
    if (loading) {
      return (
        <Table.Row>
          <Table.Cell colSpan={7}>
            <Loader
              className="loading-cell"
              active
              inline="centered"
              size="medium"
            >
              読み込み中...
            </Loader>
          </Table.Cell>
        </Table.Row>
      );
    } else {
      if (!tsukes.all) {
        return (
          <Table.Row>
            <Table.Cell colSpan={7}>
              <Message warning icon>
                <Icon name="warning circle" />
                <Message.Content>明細が見つかりません</Message.Content>
              </Message>
            </Table.Cell>
          </Table.Row>
        );
      }
      return tsukes.all.map((t) => (
        <TsukeTableRow
          key={t.id}
          tsuke={t}
          editAction={editAction}
          deleteAction={deleteAction}
        />
      ));
    }
  })();

  return (
    <Table striped compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}>日付</Table.HeaderCell>
          <Table.HeaderCell width={1}>貸主</Table.HeaderCell>
          <Table.HeaderCell width={1} />
          <Table.HeaderCell width={1}>借主</Table.HeaderCell>
          <Table.HeaderCell width={1}>金額</Table.HeaderCell>
          <Table.HeaderCell>摘要</Table.HeaderCell>
          <Table.HeaderCell width={1} />
        </Table.Row>
      </Table.Header>
      <Table.Body>{tableRows}</Table.Body>
    </Table>
  );
}
