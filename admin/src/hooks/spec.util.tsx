import { createApolloClient } from '@/providers/GraphQLServerConnectionProvider';
import { ApolloProvider } from '@apollo/client/react';

const apolloClient = createApolloClient(
  'http://localhost:20081/v1/graphql',
  'hasura',
  false,
);
export const wrapper = ({ children }: { children: any }) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);

export default wrapper;
