export interface CreateTsukeRequest {
  date: Date;
  fromUserId: number;
  toUserId: number;
  amount: number;
  description: string;
}

export interface UpdateTsukeRequest extends CreateTsukeRequest {
  id: number;
}
