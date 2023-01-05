export interface CreateUserRequest {
  name: string;
  slackId: string | null;
  position: number;
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number;
}
