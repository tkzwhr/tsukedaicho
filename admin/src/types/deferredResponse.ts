import { ApolloError } from '@apollo/client';

export interface DeferredResponse<T> {
  loading: boolean;
  data: T;
  error?: ApolloError;
}
