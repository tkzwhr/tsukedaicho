import UserTable from '@/components/presentational/UserTable';
import UpsertUserModal from '@/components/upsert-user-modal/UpsertUserModal';
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
import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import React, { useState } from 'react';

export default function UsersPage(): JSX.Element {
  const [upsertModalIsOpen, setUpsertModalIsOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const queryResult = useFetch();
  const createUser = useCreate();
  const updateUser = useUpdate();
  const deleteUser = useDelete();
  const changeUsersOrder = useChangeUsersOrder();

  const openCreateModal = () => {
    setUser(undefined);
    setUpsertModalIsOpen(true);
  };

  const openUpdateModal = (user: User) => {
    setUser(user);
    setUpsertModalIsOpen(true);
  };

  const execCreate = async (param: CreateUserRequest) => {
    await createUser(param);
    setUpsertModalIsOpen(false);
  };

  const execUpdate = async (param: UpdateUserRequest) => {
    await updateUser(param);
    setUpsertModalIsOpen(false);
  };

  const execDelete = async (user: User) => {
    await deleteUser(user?.id ?? 0);
  };

  const execMove = async (user: User, direction: Direction) => {
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
  };

  return (
    <div>
      <UserTable
        loading={queryResult.loading}
        users={queryResult.data}
        editAction={openUpdateModal}
        deleteAction={execDelete}
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
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={openCreateModal}
      />
    </div>
  );
}
