import { UsersResponse } from '@/types/users.response';
import React, { useEffect, useState } from 'react';
import { Select } from 'semantic-ui-react';

interface Props {
  users: UsersResponse;
  initial: number;
  onChanged: (id: number) => void;
}

export default function UserSelector({
  users,
  initial,
  onChanged,
}: Props): JSX.Element {
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    setUserId(initial);
  }, [initial]);

  const options = users.all.map((u) => ({
    key: u.id,
    value: u.id,
    text: u.name,
  }));

  function change(id: number) {
    setUserId(id);
    onChanged(id);
  }

  return (
    <Select
      options={options}
      value={userId}
      onChange={(e, { value }) => change(value as number)}
    />
  );
}
