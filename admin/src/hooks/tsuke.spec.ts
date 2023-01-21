import wrapper from './spec.util';
import { useCreate, useDelete, useFetch, useUpdate } from './tsukes';
import { CreateTsukeRequest, UpdateTsukeRequest } from '@/types/tsukes.request';
import { Tsuke } from '@/types/tsukes.response';

/*
  Warning: ReactDOM.render is no longer supported in React 18.
  が出るので、react-testing-libraryの方を使う
  https://zenn.dev/k_kazukiiiiii/articles/9f48bdd20435d2
 */
// import { act, renderHook } from '@testing-library/react-hooks';
import { act, renderHook, waitFor } from '@testing-library/react';
import { format, parse } from 'date-fns';

const NUMBER_OF_PRESET = 3;

function findDummyTsuke(result: any): Tsuke | undefined {
  return result.current.data.all.find((u: Tsuke) => u.id > NUMBER_OF_PRESET);
}

describe('tsuke', () => {
  beforeEach(async () => {
    const { result /*, waitForNextUpdate */ } = renderHook(() => useFetch(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toBe(undefined);
      expect(result.current.data).toBeDefined();
      expect(result.current.data.all.length).toBeGreaterThanOrEqual(
        NUMBER_OF_PRESET,
      );
    });
    // if (result.current.loading) {
    //   await waitForNextUpdate();
    // }
    //
    // expect(result.current.loading).toBeFalsy();
    // expect(result.current.error).toBe(undefined);
    // expect(result.current.data).toBeDefined();
    // expect(result.current.data.all.length).toBeGreaterThanOrEqual(
    //   NUMBER_OF_PRESET,
    // );
  });

  it('useFetch', async () => {
    const { result } = renderHook(() => useFetch(), {
      wrapper,
    });

    const tsuke = result.current.data.all.find((u) => u.id === 1);
    expect(tsuke).toBeDefined();
    expect(format(tsuke!.date, 'yyyy-MM-dd')).toBe('2021-01-01');
    expect(tsuke!.fromUser).toStrictEqual({
      id: 1,
      name: 'user1',
    });
    expect(tsuke!.toUser).toStrictEqual({
      id: 2,
      name: 'user2',
    });
    expect(tsuke!.amount).toBe(100);
    expect(tsuke!.description).toBe('Bought chocolate');
  });

  it('useCreate', async () => {
    const { result /*, waitForNextUpdate */ } = renderHook(() => useFetch(), {
      wrapper,
    });

    const { result: fn } = renderHook(() => useCreate(), {
      wrapper,
    });

    await act(async () => {
      const req: CreateTsukeRequest = {
        date: parse('2000-01-01 12:00:00', 'yyyy-MM-dd HH:mm:ss', new Date()),
        fromUserId: 1,
        toUserId: 2,
        amount: 9999,
        description: 'newTsuke',
      };
      await fn.current(req);
    });

    await waitFor(() => {
      const tsuke = findDummyTsuke(result);
      expect(tsuke).toBeDefined();
      expect(format(tsuke!.date, 'yyyy-MM-dd')).toBe('2000-01-01');
      expect(tsuke!.fromUser).toStrictEqual({
        id: 1,
        name: 'user1',
      });
      expect(tsuke!.toUser).toStrictEqual({
        id: 2,
        name: 'user2',
      });
      expect(tsuke!.amount).toBe(9999);
      expect(tsuke!.description).toBe('newTsuke');
    });
    // await waitForNextUpdate();
    //
    // const tsuke = findDummyTsuke(result);
    // expect(tsuke).toBeDefined();
    // expect(format(tsuke!.date, 'yyyy-MM-dd')).toBe('2000-01-01');
    // expect(tsuke!.fromUser).toStrictEqual({
    //   id: 1,
    //   name: 'user1',
    // });
    // expect(tsuke!.toUser).toStrictEqual({
    //   id: 2,
    //   name: 'user2',
    // });
    // expect(tsuke!.amount).toBe(9999);
    // expect(tsuke!.description).toBe('newTsuke');
  });

  it('useUpdate', async () => {
    const { result /*, waitForNextUpdate */ } = renderHook(() => useFetch(), {
      wrapper,
    });

    const { result: fn } = renderHook(() => useUpdate(), {
      wrapper,
    });

    await act(async () => {
      const param: UpdateTsukeRequest = {
        id: findDummyTsuke(result)?.id ?? 0,
        date: parse('2001-12-31 12:00:00', 'yyyy-MM-dd HH:mm:ss', new Date()),
        fromUserId: 2,
        toUserId: 1,
        amount: 99999,
        description: 'updatedTsuke',
      };
      await fn.current(param);
    });

    await waitFor(() => {
      const tsuke = findDummyTsuke(result);
      expect(format(tsuke?.date ?? new Date(), 'yyyy-MM-dd')).toBe(
        '2001-12-31',
      );
      expect(tsuke?.fromUser).toStrictEqual({
        id: 2,
        name: 'user2',
      });
      expect(tsuke?.toUser).toStrictEqual({
        id: 1,
        name: 'user1',
      });
      expect(tsuke?.amount).toBe(99999);
      expect(tsuke?.description).toBe('updatedTsuke');
    });
    // await waitForNextUpdate();
    //
    // const tsuke = findDummyTsuke(result);
    // expect(format(tsuke?.date ?? new Date(), 'yyyy-MM-dd')).toBe('2001-12-31');
    // expect(tsuke?.fromUser).toStrictEqual({
    //   id: 2,
    //   name: 'user2',
    // });
    // expect(tsuke?.toUser).toStrictEqual({
    //   id: 1,
    //   name: 'user1',
    // });
    // expect(tsuke?.amount).toBe(99999);
    // expect(tsuke?.description).toBe('updatedTsuke');
  });

  it('useDelete', async () => {
    const { result /*, waitForNextUpdate */ } = renderHook(() => useFetch(), {
      wrapper,
    });

    const { result: fn } = renderHook(() => useDelete(), {
      wrapper,
    });

    await act(async () => {
      await fn.current(findDummyTsuke(result)?.id ?? 0);
    });

    await waitFor(() => {
      const user = findDummyTsuke(result);
      expect(user).toBe(undefined);
    });
    // await waitForNextUpdate();
    //
    // const user = findDummyTsuke(result);
    // expect(user).toBe(undefined);
  });
});
