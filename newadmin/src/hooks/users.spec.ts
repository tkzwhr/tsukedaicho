import wrapper from './spec.util';
import {
  useChangeUsersOrder,
  useCreate,
  useDelete,
  useFetch,
  useUpdate,
} from './users';
import { CreateUserRequest, UpdateUserRequest } from '@/types/users.request';
import { User } from '@/types/users.response';
import { act, renderHook } from '@testing-library/react-hooks';

const NUMBER_OF_PRESET = 3;

function findDummyUser(result: any): User | undefined {
  return result.current.data.all.find((u: User) => u.id > NUMBER_OF_PRESET);
}

beforeEach(async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  if (result.current.loading) {
    await waitForNextUpdate();
  }

  expect(result.current.loading).toBeFalsy();
  expect(result.current.error).toBe(undefined);
  expect(result.current.data).toBeDefined();
  expect(result.current.data.allCount).toBeGreaterThanOrEqual(NUMBER_OF_PRESET);
});

test('fetch', async () => {
  const { result } = renderHook(() => useFetch(), {
    wrapper,
  });

  const user = result.current.data.all.find((u) => u.id === 1);
  expect(user).toBeDefined();
  expect(user!.name).toBe('user1');
  expect(user!.slackId).toBe('slack1');
  expect(user!.position).toBe(1);
});

test('create', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useCreate(), {
    wrapper,
  });

  await act(async () => {
    const req: CreateUserRequest = {
      name: 'newUser',
      slackId: 'newSlack',
      position: 9999,
    };
    await fn.current(req);
  });

  await waitForNextUpdate();

  const user = findDummyUser(result);
  expect(user).toBeDefined();
  expect(user!.name).toBe('newUser');
  expect(user!.slackId).toBe('newSlack');
  expect(user!.position).toBe(9999);
});

test('update', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useUpdate(), {
    wrapper,
  });

  await act(async () => {
    const param: UpdateUserRequest = {
      id: findDummyUser(result)?.id ?? 0,
      name: 'updatedUser',
      slackId: 'updatedSlack',
      position: 99999,
    };
    await fn.current(param);
  });

  await waitForNextUpdate();

  const user = findDummyUser(result);
  expect(user).toBeDefined();
  expect(user!.name).toBe('updatedUser');
  expect(user!.slackId).toBe('updatedSlack');
  expect(user!.position).toBe(9999); // cannot update
});

test('delete', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useDelete(), {
    wrapper,
  });

  await act(async () => {
    await fn.current(findDummyUser(result)?.id ?? 0);
  });

  await waitForNextUpdate();

  const user = findDummyUser(result);
  expect(user).toBe(undefined);
});

test('change order', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fnCreate } = renderHook(() => useCreate(), {
    wrapper,
  });
  const { result: fnDelete } = renderHook(() => useDelete(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useChangeUsersOrder(), {
    wrapper,
  });

  await act(async () => {
    const req1: CreateUserRequest = {
      name: 'userA',
      slackId: null,
      position: 100000,
    };
    await fnCreate.current(req1);
    const req2: CreateUserRequest = {
      name: 'userB',
      slackId: null,
      position: 100001,
    };
    await fnCreate.current(req2);
  });

  await waitForNextUpdate();

  const targets1 = result.current.data.all.filter(
    (u: User) => u.id > NUMBER_OF_PRESET,
  );
  targets1.sort((a, b) => a.position - b.position);
  expect(targets1.length).toBe(2);
  expect(targets1[0].name).toBe('userA');
  expect(targets1[0].position).toBe(100000);
  expect(targets1[1].name).toBe('userB');
  expect(targets1[1].position).toBe(100001);

  await act(async () => {
    await fn.current(targets1[0].id, targets1[1].id);
  });

  await waitForNextUpdate();

  const targets2 = result.current.data.all.filter(
    (u: User) => u.id > NUMBER_OF_PRESET,
  );
  targets2.sort((a, b) => a.position - b.position);
  expect(targets2.length).toBe(2);
  expect(targets2[0].name).toBe('userB');
  expect(targets2[0].position).toBe(100000);
  expect(targets2[1].name).toBe('userA');
  expect(targets2[1].position).toBe(100001);

  await act(async () => {
    await fnDelete.current(targets2[0].id);
    await fnDelete.current(targets2[1].id);
  });

  await waitForNextUpdate();

  const user = findDummyUser(result);
  expect(user).toBe(undefined);
});
