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

    return this.users.all.map((user) => {
      const columns = this.users.all.map((opponentUser) => {
        const lend = this.all
          .filter(
            (r) => r.fromUser.id === user.id && r.toUser.id === opponentUser.id,
          )
          .reduce((acc, v) => acc + v.amount, 0);
        const borrow = this.all
          .filter(
            (r) => r.toUser.id === user.id && r.fromUser.id === opponentUser.id,
          )
          .reduce((acc, v) => acc + v.amount, 0);
        return {
          id: opponentUser.id,
          name: opponentUser.name,
          amount: lend - borrow,
        };
      });
      return {
        id: user.id,
        name: user.name,
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
