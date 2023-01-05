import './UserTable.styl';
import UserTableRow from '@/components/user-table/UserTableRow';
import { Direction } from '@/types/enums';
import { User, UsersResponse } from '@/types/users.response';
import React from 'react';
import { Icon, Loader, Message, Table } from 'semantic-ui-react';

interface Props {
  loading: boolean;
  users: UsersResponse;
  editAction: (user: User) => void;
  deleteAction: (user: User) => void;
  moveAction: (target: User, direction: Direction) => void;
}

export default function RecordTable({
  loading,
  users,
  editAction,
  deleteAction,
  moveAction,
}: Props): JSX.Element {
  const tableRows = (() => {
    if (loading) {
      return (
        <Table.Row>
          <Table.Cell colSpan={3}>
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
      if (!users.all) {
        return (
          <Table.Row>
            <Table.Cell colSpan={3}>
              <Message warning icon>
                <Icon name="warning circle" />
                <Message.Content>ユーザが見つかりません</Message.Content>
              </Message>
            </Table.Cell>
          </Table.Row>
        );
      }
      return users.all.map((u) => (
        <UserTableRow
          key={u.id}
          user={u}
          canMoveUpward={u.position > 1}
          canMoveDownward={u.position < users.allCount}
          editAction={editAction}
          deleteAction={deleteAction}
          moveAction={moveAction}
        />
      ));
    }
  })();

  return (
    <Table striped compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>名前</Table.HeaderCell>
          <Table.HeaderCell>Slack ID</Table.HeaderCell>
          <Table.HeaderCell width={1} />
        </Table.Row>
      </Table.Header>
      <Table.Body>{tableRows}</Table.Body>
    </Table>
  );
}
