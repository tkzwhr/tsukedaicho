import { SummaryRow } from '@/types/summary';
import { UsersResponse } from '@/types/users.response';

export class TsukesResponse {
  tsukes: Tsuke[];
  users: UsersResponse;

  constructor(tsukes: Tsuke[], users: UsersResponse) {
    this.tsukes = tsukes;
    this.users = users;
  }

  get all(): Tsuke[] {
    return this.tsukes;
  }

  get isEmpty(): boolean {
    return this.all.length === 0;
  }

  summarize(): SummaryRow[] {
    if (this.users.allCount < 2) {
      return [];
    }
    if (this.isEmpty) {
      return [];
    }

    return this.users.all.map((u) => {
      const columns = this.users.all.map((v) => {
        const lend = this.all
          .filter((r) => r.toUser.id === u.id && r.fromUser.id === v.id)
          .reduce((acc, v) => acc + v.amount, 0);
        const borrow = this.all
          .filter((r) => r.toUser.id === v.id && r.fromUser.id === u.id)
          .reduce((acc, v) => acc + v.amount, 0);
        return {
          id: v.id,
          name: v.name,
          amount: lend - borrow,
        };
      });
      return {
        id: u.id,
        name: u.name,
        columns,
      };
    });
  }
}

export interface Tsuke {
  id: number;
  date: Date;
  fromUser: {
    id: number;
    name: string;
  };
  toUser: {
    id: number;
    name: string;
  };
  amount: number;
  description: string;
}
