import { Tsuke } from "@/types/tsukes.response";
import { format } from "date-fns";
import React from "react";
import { Dropdown, Icon, Table } from "semantic-ui-react";

interface Props {
  tsuke: Tsuke;
  editAction: (target: Tsuke) => void;
  deleteAction: (target: Tsuke) => void;
}

export default function TsukeTableRow({
  tsuke,
  editAction,
  deleteAction,
}: Props): JSX.Element {
  function toISODate(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  return (
    <Table.Row>
      <Table.Cell>{toISODate(tsuke.date)}</Table.Cell>
      <Table.Cell>{tsuke.fromUser.name}</Table.Cell>
      <Table.Cell>
        <Icon name="play" />
      </Table.Cell>
      <Table.Cell>{tsuke.toUser.name}</Table.Cell>
      <Table.Cell>{tsuke.amount}円</Table.Cell>
      <Table.Cell>{tsuke.description}</Table.Cell>
      <Table.Cell>
        <Dropdown className="icon" icon="ellipsis vertical" floating button>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="edit"
              text="編集"
              onClick={() => editAction(tsuke)}
            />
            <Dropdown.Item
              icon="trash"
              text="削除"
              onClick={() => deleteAction(tsuke)}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    </Table.Row>
  );
}
