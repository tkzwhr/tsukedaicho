import TsukeTable from '@/components/tsuke-table/TsukeTable';
import UpsertTsukeModal from '@/components/upsert-tsuke-modal/UpsertTsukeModal';
import { useCreate, useDelete, useFetch, useUpdate } from '@/hooks/tsukes';
import { CreateTsukeRequest, UpdateTsukeRequest } from '@/types/tsukes.request';
import { Tsuke } from '@/types/tsukes.response';
import React, { useState } from 'react';
import { Button, Confirm, Container, Header, Icon } from 'semantic-ui-react';

export default function TsukesPage(): JSX.Element {
  const [upsertModalIsOpen, setUpsertModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [tsuke, setTsuke] = useState<Tsuke | undefined>(undefined);

  const queryResult = useFetch();
  const createTsuke = useCreate();
  const updateTsuke = useUpdate();
  const deleteTsuke = useDelete();

  function openCreateModal() {
    setTsuke(undefined);
    setUpsertModalIsOpen(true);
  }

  function openUpdateModal(tsuke: Tsuke) {
    setTsuke(tsuke);
    setUpsertModalIsOpen(true);
  }

  function openDeleteModal(tsuke: Tsuke) {
    setTsuke(tsuke);
    setDeleteModalIsOpen(true);
  }

  async function execCreate(param: CreateTsukeRequest) {
    await createTsuke(param);
    setUpsertModalIsOpen(false);
  }

  async function execUpdate(param: UpdateTsukeRequest) {
    await updateTsuke(param);
    setUpsertModalIsOpen(false);
  }

  async function execDelete() {
    await deleteTsuke(tsuke?.id ?? 0);
    setDeleteModalIsOpen(false);
  }

  return (
    <div>
      <Header as="h2">明細</Header>
      <Container fluid textAlign="right">
        <Button primary onClick={openCreateModal}>
          <Icon name="add" />
          追加
        </Button>
      </Container>
      <TsukeTable
        loading={queryResult.loading}
        tsukes={queryResult.data}
        editAction={openUpdateModal}
        deleteAction={openDeleteModal}
      />
      <UpsertTsukeModal
        open={upsertModalIsOpen}
        tsuke={tsuke}
        users={queryResult.data.users}
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
