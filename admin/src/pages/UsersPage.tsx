import UpsertUserModal from '@/components/upsert-user-modal/UpsertUserModal';
import UserTable from '@/components/user-table/UserTable';
import {
  useChangeUsersOrder,
  useCreate,
  useDelete,
  useFetch,
  useUpdate,
} from '@/hooks/users';
import { Direction } from '@/types/enums';
import { CreateUserRequest, UpdateUserRequest } from '@/types/users.request';
import { User } from '@/types/users.response';
import React, { useState } from 'react';
import { Button, Confirm, Container, Header, Icon } from 'semantic-ui-react';

export default function UsersPage(): JSX.Element {
  const [upsertModalIsOpen, setUpsertModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const queryResult = useFetch();
  const createUser = useCreate();
  const updateUser = useUpdate();
  const deleteUser = useDelete();
  const changeUsersOrder = useChangeUsersOrder();

  function openCreateModal() {
    setUser(undefined);
    setUpsertModalIsOpen(true);
  }

  function openUpdateModal(user: User) {
    setUser(user);
    setUpsertModalIsOpen(true);
  }

  function openDeleteModal(user: User) {
    setUser(user);
    setDeleteModalIsOpen(true);
  }

  async function execCreate(param: CreateUserRequest) {
    await createUser(param);
    setUpsertModalIsOpen(false);
  }

  async function execUpdate(param: UpdateUserRequest) {
    await updateUser(param);
    setUpsertModalIsOpen(false);
  }

  async function execDelete() {
    await deleteUser(user?.id ?? 0);
    setDeleteModalIsOpen(false);
  }

  async function execMove(user: User, direction: Direction) {
    switch (direction) {
      case 'upward': {
        const upperId = queryResult.data.upperUser(user.id)?.id;
        if (!upperId) {
          console.warn(`Upper user not found. userId=${user.id}`);
          break;
        }
        await changeUsersOrder(upperId, user.id);
        break;
      }
      case 'downward': {
        const lowerId = queryResult.data.lowerUser(user.id)?.id;
        if (!lowerId) {
          console.warn(`Lower user not found. userId=${user.id}`);
          break;
        }
        await changeUsersOrder(user.id, lowerId);
        break;
      }
    }
  }

  return (
    <div>
      <Header as="h2">ユーザ</Header>
      <Container fluid textAlign="right">
        <Button primary onClick={openCreateModal}>
          <Icon name="add" />
          追加
        </Button>
      </Container>
      <UserTable
        loading={queryResult.loading}
        users={queryResult.data}
        editAction={openUpdateModal}
        deleteAction={openDeleteModal}
        moveAction={execMove}
      />
      <UpsertUserModal
        open={upsertModalIsOpen}
        user={user}
        position={queryResult.data.allCount + 1}
        onCreated={execCreate}
        onUpdated={execUpdate}
        onClosed={() => setUpsertModalIsOpen(false)}
      />
      <Confirm
        open={deleteModalIsOpen}
        content="本当に削除してもよろしいですか？この操作は取り消せません。"
        cancelButton="キャンセル"
        confirmButton={<Button negative>削除する</Button>}
        onCancel={() => setDeleteModalIsOpen(false)}
        onConfirm={execDelete}
      />
    </div>
  );
}
