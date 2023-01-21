import CreateTsukeQuery from '@/graphql/create_tsuke.graphql?raw';
import DeleteTsukeQuery from '@/graphql/delete_tsuke.graphql?raw';
import FetchTsukesAndUsersQuery from '@/graphql/fetch_tsukes_and_users.graphql?raw';
import UpdateTsukeQuery from '@/graphql/update_tsuke.graphql?raw';
import { mapUser } from '@/hooks/users';
import { DeferredResponse } from '@/types/deferredResponse';
import { CreateTsukeRequest, UpdateTsukeRequest } from '@/types/tsukes.request';
import { Tsuke, TsukesResponse } from '@/types/tsukes.response';
import { UsersResponse } from '@/types/users.response';
import { gql, useMutation, useQuery } from '@apollo/client';
import { parse } from 'date-fns';

export function useFetch(): DeferredResponse<TsukesResponse> {
  const queryResult = useQuery(gql(FetchTsukesAndUsersQuery));

  if (queryResult.loading) {
    return {
      loading: true,
      data: new TsukesResponse([], new UsersResponse([])),
    };
  }

  if (queryResult.error) {
    return {
      loading: false,
      data: new TsukesResponse([], new UsersResponse([])),
      error: queryResult.error,
    };
  }

  const tsukes = queryResult.data.tsukes.map(mapTsuke);
  const users = queryResult.data.users.map(mapUser);

  return {
    loading: false,
    data: new TsukesResponse(tsukes, new UsersResponse(users)),
  };
}

export function useCreate(): (param: CreateTsukeRequest) => Promise<void> {
  const [fn] = useMutation(gql(CreateTsukeQuery));
  return (param: CreateTsukeRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_TSUKES_AND_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useUpdate(): (param: UpdateTsukeRequest) => Promise<void> {
  const [fn] = useMutation(gql(UpdateTsukeQuery));
  return (param: UpdateTsukeRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_TSUKES_AND_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useDelete(): (id: number) => Promise<void> {
  const [fn] = useMutation(gql(DeleteTsukeQuery));
  return (id: number) =>
    fn({
      variables: { id },
      refetchQueries: [FETCH_TSUKES_AND_USERS_KEY],
    }).then(() => {
      return;
    });
}

const FETCH_TSUKES_AND_USERS_KEY = 'FetchTsukesAndUsers';

function mapTsuke(data: any): Tsuke {
  return {
    id: data.id,
    date: parse(data.date, 'yyyy-MM-dd', new Date()),
    fromUser: data.from_user,
    toUser: data.to_user,
    amount: data.amount,
    description: data.description,
  };
}
