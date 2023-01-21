import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';
import { ApolloProvider } from '@apollo/client/react';
import fetch from 'cross-fetch';
import React from 'react';
import { useLocalStorage } from 'react-use';

export type GraphQLServerConnection = {
  endpoint: string | undefined;
  secret: string | undefined;
};

type GraphQLServerConnectionState = GraphQLServerConnection & {
  setEndpoint: (v: string) => void;
  setSecret: (v: string) => void;
};

export const GraphQLServerConnectionContext =
  React.createContext<GraphQLServerConnectionState>({
    endpoint: '',
    setEndpoint: () => {},
    secret: '',
    setSecret: () => {},
  });

export function createApolloClient(
  endpoint: string | undefined,
  secret: string | undefined,
  addTypename = true,
): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: endpoint,
    fetch,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': secret ?? '',
      },
    };
  });
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ addTypename }),
  });
}

export default function GraphQLServerConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [endpoint, setEndpoint] = useLocalStorage('ENDPOINT', '');
  const [secret, setSecret] = useLocalStorage('SECRET', '');

  return (
    <GraphQLServerConnectionContext.Provider
      value={{ endpoint, setEndpoint, secret, setSecret }}
    >
      <GraphQLServerConnectionContext.Consumer>
        {(srvConnCtx) => (
          <ApolloProvider
            client={createApolloClient(srvConnCtx.endpoint, srvConnCtx.secret)}
          >
            {children}
          </ApolloProvider>
        )}
      </GraphQLServerConnectionContext.Consumer>
    </GraphQLServerConnectionContext.Provider>
  );
}
