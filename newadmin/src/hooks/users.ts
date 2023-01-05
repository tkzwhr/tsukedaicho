import ChangeUsersOrderQuery from '@/graphql/change_users_order.graphql?raw';
import CreateUserQuery from '@/graphql/create_user.graphql?raw';
import DeleteUserQuery from '@/graphql/delete_user.graphql?raw';
import FetchUsersQuery from '@/graphql/fetch_users.graphql?raw';
import UpdateUserQuery from '@/graphql/update_user.graphql?raw';
import { DeferredResponse } from '@/types/deferredResponse';
import { CreateUserRequest, UpdateUserRequest } from '@/types/users.request';
import { User, UsersResponse } from '@/types/users.response';
import { gql, useMutation, useQuery } from '@apollo/client';

export function useFetch(): DeferredResponse<UsersResponse> {
  const queryResult = useQuery(gql(FetchUsersQuery));

  if (queryResult.loading) {
    return {
      loading: true,
      data: new UsersResponse([]),
    };
  }

  if (queryResult.error) {
    return {
      loading: false,
      data: new UsersResponse([]),
      error: queryResult.error,
    };
  }

  const users = queryResult.data.users.map(mapUser);

  return {
    loading: false,
    data: new UsersResponse(users),
  };
}

export function useCreate(): (param: CreateUserRequest) => Promise<void> {
  const [fn] = useMutation(gql(CreateUserQuery));
  return (param: CreateUserRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useUpdate(): (param: UpdateUserRequest) => Promise<void> {
  const [fn] = useMutation(gql(UpdateUserQuery));
  return (param: UpdateUserRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useDelete(): (id: number) => Promise<void> {
  const [fn] = useMutation(gql(DeleteUserQuery));
  return (id: number) =>
    fn({
      variables: { id },
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useChangeUsersOrder(): (
  upperId: number,
  lowerId: number,
) => Promise<void> {
  const [fn] = useMutation(gql(ChangeUsersOrderQuery));
  return (upperId: number, lowerId: number) =>
    fn({
      variables: { upperId, lowerId },
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

const FETCH_USERS_KEY = 'FetchUsers';

export function mapUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    slackId: data.slack_id,
    position: data.position,
  };
}
