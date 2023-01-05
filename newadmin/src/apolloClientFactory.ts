import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export default function createApolloClient(
  endpoint: string | undefined,
  secret: string | undefined,
  addTypename = true,
): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: endpoint,
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
