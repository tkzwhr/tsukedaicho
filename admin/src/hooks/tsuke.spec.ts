import wrapper from "./spec.util";
import { useCreate, useDelete, useFetch, useUpdate } from "./tsukes";
import { CreateTsukeRequest, UpdateTsukeRequest } from "@/types/tsukes.request";
import { Tsuke } from "@/types/tsukes.response";
import { act, renderHook } from "@testing-library/react-hooks";
import { format, parse } from "date-fns";


const NUMBER_OF_PRESET = 3;

function findDummyTsuke(result: any): Tsuke | undefined {
  return result.current.data.all.find((u: Tsuke) => u.id > NUMBER_OF_PRESET);
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
  expect(result.current.data.all.length).toBeGreaterThanOrEqual(
    NUMBER_OF_PRESET
  );
});

test("fetch", async () => {
  const { result } = renderHook(() => useFetch(), {
    wrapper,
  });

  const tsuke = result.current.data.all.find((u) => u.id === 1);
  expect(tsuke).toBeDefined();
  expect(format(tsuke!.date, "yyyy-MM-dd")).toBe("2021-01-01");
  expect(tsuke!.fromUser).toStrictEqual({
    id: 1,
    name: "user1",
  });
  expect(tsuke!.toUser).toStrictEqual({
    id: 2,
    name: "user2",
  });
  expect(tsuke!.amount).toBe(100);
  expect(tsuke!.description).toBe("Bought chocolate");
});

test("create", async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useCreate(), {
    wrapper,
  });

  await act(async () => {
    const req: CreateTsukeRequest = {
      date: parse("2000-01-01 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      fromUserId: 1,
      toUserId: 2,
      amount: 9999,
      description: "newTsuke",
    };
    await fn.current(req);
  });

  await waitForNextUpdate();

  const tsuke = findDummyTsuke(result);
  expect(tsuke).toBeDefined();
  expect(format(tsuke!.date, "yyyy-MM-dd")).toBe("2000-01-01");
  expect(tsuke!.fromUser).toStrictEqual({
    id: 1,
    name: "user1",
  });
  expect(tsuke!.toUser).toStrictEqual({
    id: 2,
    name: "user2",
  });
  expect(tsuke!.amount).toBe(9999);
  expect(tsuke!.description).toBe("newTsuke");
});

test("update", async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useUpdate(), {
    wrapper,
  });

  await act(async () => {
    const param: UpdateTsukeRequest = {
      id: findDummyTsuke(result)?.id ?? 0,
      date: parse("2001-12-31 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
      fromUserId: 2,
      toUserId: 1,
      amount: 99999,
      description: "updatedTsuke",
    };
    await fn.current(param);
  });

  await waitForNextUpdate();

  const tsuke = findDummyTsuke(result);
  expect(format(tsuke?.date ?? new Date(), "yyyy-MM-dd")).toBe("2001-12-31");
  expect(tsuke?.fromUser).toStrictEqual({
    id: 2,
    name: "user2",
  });
  expect(tsuke?.toUser).toStrictEqual({
    id: 1,
    name: "user1",
  });
  expect(tsuke?.amount).toBe(99999);
  expect(tsuke?.description).toBe("updatedTsuke");
});

test("delete", async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFetch(), {
    wrapper,
  });

  const { result: fn } = renderHook(() => useDelete(), {
    wrapper,
  });

  await act(async () => {
    await fn.current(findDummyTsuke(result)?.id ?? 0);
  });

  await waitForNextUpdate();

  const user = findDummyTsuke(result);
  expect(user).toBe(undefined);
});