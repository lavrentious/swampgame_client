export interface TelegramAuthRequest {
  data: string;
}

export interface AuthUser {
  userId: number;
  telegramId: number;
}

export interface AuthResponse {
  jwt: string;

  userId: number;
  telegramId: number;
}
