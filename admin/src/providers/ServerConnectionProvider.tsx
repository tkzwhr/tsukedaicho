import React from 'react';
import { useLocalStorage } from 'react-use';

export type ContextValues = {
  endpoint: string | undefined;
  secret: string | undefined;
};

type ContextProperties = ContextValues & {
  setEndpoint: (v: string) => void;
  setSecret: (v: string) => void;
};

export const ServerConnectionContext = React.createContext<ContextProperties>({
  endpoint: '',
  setEndpoint: () => {
    return;
  },
  secret: '',
  setSecret: () => {
    return;
  },
});

export default function ServerConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [endpoint, setEndpoint] = useLocalStorage('ENDPOINT', '');
  const [secret, setSecret] = useLocalStorage('SECRET', '');

  return (
    <ServerConnectionContext.Provider
      value={{ endpoint, setEndpoint, secret, setSecret }}
    >
      {children}
    </ServerConnectionContext.Provider>
  );
}
