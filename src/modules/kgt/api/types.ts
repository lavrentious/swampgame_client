export type RoomStatus =
  | "WAITING"
  | "STARTING"
  | "IN_PROGRESS"
  | "PAUSED"
  | "FINISHED"
  | "CANCELLED";

export type Player = {
  id: number;
  firstName?: string;
  imageUrl?: string;
  isHost?: boolean;
  isWaiting?: boolean;
};

export type Room = {
  createdAt: string;
  creatorTgId: number;
  currentPlayers: number;
  hasPassword: boolean;
  maxPlayers: number;
  players: Player[];
  roomId: number;
  roomName: string;
  status: RoomStatus;
};
