import { useLaunchParams, useRawInitData } from "@telegram-apps/sdk-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useTelegramAuthMutation } from "src/modules/auth/api/auth";
import { formatApiError } from "src/modules/common/api/utils";
import { useSetPhotoUrlMutation } from "src/modules/users/api/users";
import { useAppDispatch, useAppSelector } from "src/store";
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

  const [setPhoto] = useSetPhotoUrlMutation();
  const authUser = useAppSelector((state) => state.auth.user);
  const { tgWebAppData: data } = useLaunchParams();
  const isPhotoSet = useRef(false);

  useEffect(() => {
    if (isPhotoSet.current || !data?.user || !authUser) return;
    if (!data.user.photo_url) {
      isPhotoSet.current = true;
      return;
    }
    setPhoto({ userId: authUser.userId, photoUrl: data.user?.photo_url })
      .unwrap()
      .then(() => (isPhotoSet.current = true))
      .catch((e) => toast.error(formatApiError(e)));
  }, [initDataRaw, setPhoto, data, authUser]);

  return null;
}
