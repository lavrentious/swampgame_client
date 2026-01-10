export type User = {
  id: number;
  telegramId: number;
  username: string;
  level: number;
  xp: number;
  balance: number;
};

export interface FriendshipRequest {
  requesterUserId: number;
  addresseeUserId: number;
}

export interface FriendshipResponse {
  message: string;
}

export interface Friendship {
  requesterUserId: number;
  addresseeUserId: number;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}
