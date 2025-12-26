import { useRawInitData } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTelegramAuthMutation } from "src/modules/kgt/api/auth";
import { formatApiError } from "../api/utils";

export function AuthBootstrap() {
  const initDataRaw = useRawInitData();
  const [telegramAuth] = useTelegramAuthMutation();

  useEffect(() => {
    if (!initDataRaw) return;

    telegramAuth({ data: initDataRaw })
      .unwrap()
      .catch((e) => toast.error(formatApiError(e)));
  }, [initDataRaw, telegramAuth]);

  return null;
}
