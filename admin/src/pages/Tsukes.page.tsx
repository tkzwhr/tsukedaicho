import TsukeCalendar from '@/components/TsukeCalendar';
import TsukeList from '@/components/TsukeList';
import UpsertTsukeModal from '@/components/UpsertTsuke.modal';
import { useCreate, useDelete, useFetch, useUpdate } from '@/hooks/tsukes';
import { CreateTsukeRequest, UpdateTsukeRequest } from '@/types/tsukes.request';
import { Tsuke } from '@/types/tsukes.response';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, FloatButton, Space } from 'antd';
import { isSameDay } from 'date-fns';
import React, { useState } from 'react';

export default function TsukesPage(): JSX.Element {
  const [upsertModalIsOpen, setUpsertModalIsOpen] = useState(false);
  const [tsuke, setTsuke] = useState<Tsuke | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  async function execCreate(param: CreateTsukeRequest) {
    await createTsuke(param);
    setUpsertModalIsOpen(false);
  }

  async function execUpdate(param: UpdateTsukeRequest) {
    await updateTsuke(param);
    setUpsertModalIsOpen(false);
  }

  async function execDelete(tsuke: Tsuke) {
    await deleteTsuke(tsuke?.id ?? 0);
  }

  const filteredTsuke = queryResult.data.all.filter(
    (d) => selectedDate && isSameDay(selectedDate, d.date),
  );

  return (
    <>
      <Space align="start" size="large" split={<Divider type="vertical" />}>
        <TsukeCalendar
          loading={queryResult.loading}
          tsukes={queryResult.data}
          selectAction={setSelectedDate}
        />
        <TsukeList
          date={selectedDate}
          tsukes={filteredTsuke}
          editAction={openUpdateModal}
          deleteAction={execDelete}
        />
      </Space>
      <UpsertTsukeModal
        open={upsertModalIsOpen}
        tsuke={tsuke}
        date={selectedDate}
        users={queryResult.data.users}
        onCreated={execCreate}
        onUpdated={execUpdate}
        onClosed={() => setUpsertModalIsOpen(false)}
      />
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={openCreateModal}
      />
    </>
  );
}
