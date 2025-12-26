export interface TelegramAuthRequest {
  data: string;
}

export interface AuthUser {
  id: number;
  telegramId: number;
}

export interface AuthResponse {
  jwt: string;

  id: number;
  telegramId: number;
}
