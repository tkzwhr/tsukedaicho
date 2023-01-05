import { Direction } from '@/types/enums';
import { User } from '@/types/users.response';
import React from 'react';
import { Dropdown, Table } from 'semantic-ui-react';

interface Props {
  user: User;
  canMoveUpward: boolean;
  canMoveDownward: boolean;
  editAction: (target: User) => void;
  deleteAction: (target: User) => void;
  moveAction: (target: User, direction: Direction) => void;
}

export default function UserTableRow({
  user,
  canMoveUpward,
  canMoveDownward,
  editAction,
  deleteAction,
  moveAction,
}: Props): JSX.Element {
  return (
    <Table.Row>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.slackId ?? '-'}</Table.Cell>
      <Table.Cell>
        <Dropdown className="icon" icon="ellipsis vertical" floating button>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="edit"
              text="編集"
              onClick={() => editAction(user)}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              icon="sort up"
              text="上に移動"
              disabled={!canMoveUpward}
              onClick={() => moveAction(user, 'upward')}
            />
            <Dropdown.Item
              icon="sort down"
              text="下に移動"
              disabled={!canMoveDownward}
              onClick={() => moveAction(user, 'downward')}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              icon="trash"
              text="削除"
              onClick={() => deleteAction(user)}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    </Table.Row>
  );
}
