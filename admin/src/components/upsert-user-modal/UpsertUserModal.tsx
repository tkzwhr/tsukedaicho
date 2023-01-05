import { CreateUserRequest, UpdateUserRequest } from '@/types/users.request';
import { User } from '@/types/users.response';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

interface Props {
  open: boolean;
  user?: User;
  position: number;
  onCreated?: (param: CreateUserRequest) => void;
  onUpdated?: (param: UpdateUserRequest) => void;
  onClosed?: () => void;
}

export default function UpsertUserModal({
  open,
  user,
  position,
  onCreated,
  onUpdated,
  onClosed,
}: Props): JSX.Element {
  const [name, setName] = useState('');
  const [slackId, setSlackId] = useState('');

  useEffect(() => {
    if (open) {
      setName(user?.name ?? '');
      setSlackId(user?.slackId ?? '');
    }
  }, [open]);

  function upsert() {
    if (user) {
      onUpdated &&
        onUpdated({
          id: user.id,
          name,
          slackId: slackId.length > 0 ? slackId : null,
          position: user.position,
        });
    } else {
      onCreated &&
        onCreated({
          name,
          slackId: slackId.length > 0 ? slackId : null,
          position,
        });
    }
  }

  return (
    <Modal
      open={open}
      closeOnDimmerClick={false}
      closeOnEscape={true}
      onClose={onClosed}
    >
      <Modal.Header>
        {user ? `${user.name}の編集` : `ユーザの追加`}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field required={true}>
            <label>名前</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Field>
          <Form.Field>
            <label>Slack ID</label>
            <input
              value={slackId}
              onChange={(e) => setSlackId(e.target.value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClosed}>キャンセル</Button>
        <Button onClick={upsert} primary>
          {user ? '更新' : '追加'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
