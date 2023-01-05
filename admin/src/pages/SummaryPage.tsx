import SummaryTable from '@/components/summary-table/SummaryTable';
import { useFetch } from '@/hooks/tsukes';
import React from 'react';
import { Header } from 'semantic-ui-react';

export default function SummaryPage(): JSX.Element {
  const queryResult = useFetch();

  return (
    <div>
      <Header as="h2">サマリ</Header>
      <SummaryTable loading={queryResult.loading} tsukes={queryResult.data} />
    </div>
  );
}
