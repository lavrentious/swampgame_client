export type User = {
  id: number;
  telegramId: number;
  username: string;
  level: number;
  xp: number;
  balance: number;
  photoUrl?: string | null;
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
