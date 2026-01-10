import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useParams } from "react-router";
import MainLayout from "src/modules/common/components/MainLayout";
import UserPfp from "src/modules/users/components/UserPfp";

import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { formatApiError } from "src/modules/common/api/utils";
import IconButton from "src/modules/common/components/IconButton";
import { useAppSelector } from "src/store";
import List from "src/ui/components/List";
import ListItem from "src/ui/components/ListItem";
import {
  useAreFriendsQuery,
  useFindUserByIdQuery,
  useOfferFriendshipMutation,
} from "../api/users";

const ProfileProperty: React.FC<{
  title: string;
  value: React.ReactNode | string;
}> = ({ title, value }) => {
  return (
    <ListItem className="flex justify-between">
      <span className="text-text-secondary">{title}</span>
      {typeof value === "string" || typeof value === "number" ? (
        <strong>{value}</strong>
      ) : (
        value
      )}
    </ListItem>
  );
};

const ProfilePage = () => {
  const { id } = useParams<{ id?: string }>();

  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const authUser = useAppSelector((s) => s.auth.user);

  const userId = useMemo(() => {
    if (id) return +id;
    return authUser?.userId;
  }, [authUser?.userId, id]);

  const {
    data: user,
    isLoading,
    isError,
  } = useFindUserByIdQuery(!userId || !isAuth ? skipToken : userId, {
    pollingInterval: 10000,
  });

  const [offerFriendship, { isLoading: isOfferFriendshipLoading }] =
    useOfferFriendshipMutation();

  const { tgWebAppData: data } = useLaunchParams();
  const photoUrl = data?.user?.photo_url;

  const isSelf = useMemo(() => {
    if (!user || !authUser) return;
    return user.id === authUser.userId;
  }, [authUser, user]);

  const { data: areFriends } = useAreFriendsQuery(
    authUser && user && !isSelf
      ? { user1: authUser.userId, user2: user.id }
      : skipToken,
    { pollingInterval: 10000 },
  );

  const pageTitle = useMemo<string>(() => {
    if (isSelf) return "My Profile";
    if (user) return `${user.username}'s profile`;
    if (isLoading) return "Loading...";
    return "Profile";
  }, [isLoading, isSelf, user]);

  return (
    <MainLayout title={pageTitle} showBackButton showUserPfp={false}>
      <div className="mt-10 p-4">
        <UserPfp
          className="mx-auto mb-5"
          size={96}
          photoUrl={isSelf ? photoUrl : undefined}
        />

        {isLoading && (
          <p className="text-center text-muted">Loading profile…</p>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load profile</p>
        )}

        {user && (
          <>
            <div className="flex items-baseline gap-2 justify-center">
              <span className="text-center text-2xl font-bold mb-5">
                {user.username}{" "}
                <span className="text-muted">#{user.id}</span>{" "}
              </span>
              {!isSelf &&
                (areFriends ? (
                  <FaUserCheck className="inline" />
                ) : (
                  <IconButton
                    size="sm"
                    icon={<FaUserPlus />}
                    onClick={() =>
                      offerFriendship({
                        addresseeUserId: user.id,
                        requesterUserId: authUser!.userId,
                      })
                        .unwrap()
                        .then((res) => {
                          toast.success(res.message);
                        })
                        .catch((e) => {
                          toast.error(formatApiError(e));
                        })
                    }
                    disabled={isOfferFriendshipLoading}
                  />
                ))}
            </div>

            <List>
              <ProfileProperty title="Level" value={user.level} />
              <ProfileProperty title="XP" value={user.xp} />
              <ProfileProperty title="Balance" value={user.balance} />
            </List>
          </>
        )}

        <div className="mt-6 text-center">
          <Link to="/test" className="text-sm text-muted underline">
            test
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
