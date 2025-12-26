import { useRawInitData } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTelegramAuthMutation } from "src/modules/auth/api/auth";
import { formatApiError } from "src/modules/common/api/utils";
import { useAppDispatch } from "src/store";
import { setInitData } from "../store/authSlice";

export function AuthBootstrap() {
  const initDataRaw = useRawInitData();
  const [telegramAuth] = useTelegramAuthMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initDataRaw) return;
    dispatch(setInitData(initDataRaw));

    telegramAuth({ data: initDataRaw })
      .unwrap()
      .catch((e) => toast.error(formatApiError(e)));
  }, [dispatch, initDataRaw, telegramAuth]);

  return null;
}
