import SummaryTable from '@/components/SummaryTable';
import { useFetch } from '@/hooks/tsukes';
import React from 'react';

export default function SummaryPage(): JSX.Element {
  const queryResult = useFetch();

  return (
    <>
      <SummaryTable loading={queryResult.loading} tsukes={queryResult.data} />
    </>
  );
}
