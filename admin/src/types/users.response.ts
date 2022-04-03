export class UsersResponse {
  users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  get all(): User[] {
    return this.users;
  }

  get allCount(): number {
    return this.all.length;
  }

  upperUser(userId: number): User | undefined {
    const user = this.all.find((u) => u.id === userId);
    if (user) {
      return this.all.find((u) => u.position === user.position - 1);
    }
    return undefined;
  }

  lowerUser(userId: number): User | undefined {
    const user = this.all.find((u) => u.id === userId);
    if (user) {
      return this.all.find((u) => u.position === user.position + 1);
    }
    return undefined;
  }
}

export interface User {
  id: number;
  name: string;
  slackId?: string;
  position: number;
}
