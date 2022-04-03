import ChangeUsersOrderQuery from "./queries/change_users_order.graphql";
import CreateUserQuery from "./queries/create_user.graphql";
import DeleteUserQuery from "./queries/delete_user.graphql";
import FetchUsersQuery from "./queries/fetch_users.graphql";
import UpdateUserQuery from "./queries/update_user.graphql";
import { DeferredResponse } from "@/types/deferredResponse";
import { CreateUserRequest, UpdateUserRequest } from "@/types/users.request";
import { User, UsersResponse } from "@/types/users.response";
import { useMutation, useQuery } from "@apollo/client";


export function useFetch(): DeferredResponse<UsersResponse> {
  const queryResult = useQuery(FetchUsersQuery);

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
  const [fn] = useMutation(CreateUserQuery);
  return (param: CreateUserRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useUpdate(): (param: UpdateUserRequest) => Promise<void> {
  const [fn] = useMutation(UpdateUserQuery);
  return (param: UpdateUserRequest) =>
    fn({
      variables: param,
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

export function useDelete(): (id: number) => Promise<void> {
  const [fn] = useMutation(DeleteUserQuery);
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
  lowerId: number
) => Promise<void> {
  const [fn] = useMutation(ChangeUsersOrderQuery);
  return (upperId: number, lowerId: number) =>
    fn({
      variables: { upperId, lowerId },
      refetchQueries: [FETCH_USERS_KEY],
    }).then(() => {
      return;
    });
}

const FETCH_USERS_KEY = "FetchUsers";

export function mapUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    slackId: data.slack_id,
    position: data.position,
  };
}