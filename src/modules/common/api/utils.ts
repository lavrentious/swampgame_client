import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { TFunction } from "i18next";

export function formatApiError(
  error: FetchBaseQueryError | SerializedError | undefined,
  t?: TFunction,
): string {
  if (!error)
    return t ? t("common.unknownError") : "Произошла неизвестная ошибка.";

  if ("status" in error) {
    // Network / fetch failure
    if (error.status === "FETCH_ERROR") {
      return t
        ? t("common.unableToConnect")
        : "Не удалось подключиться к серверу. Проверьте соединение.";
    }

    // Server responded with HTTP status and possibly our typed ApiError
    if (typeof error.status === "number") {
      const data = error.data as { message?: string; statusCode?: number };

      if (data?.message) {
        return data.message;
      }

      return `${t ? t("common.error") : "Ошибка"} ${error.status}`;
    }
  }

  // Fallback for unexpected serialized errors
  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return t ? t("common.unknownError") : "Произошла неизвестная ошибка.";
}

export function decodeJwtPayload<T = unknown>(token: string): T {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const base64Url = parts[1];
  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");

  const json = atob(base64);
  return JSON.parse(json);
}
