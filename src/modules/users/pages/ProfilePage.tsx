import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import MainLayout from "src/modules/common/components/MainLayout";
import UserPfp from "src/modules/users/components/UserPfp";
import { RootState } from "src/store";

import List from "src/ui/components/List";
import ListItem from "src/ui/components/ListItem";
import { useFindUserByIdQuery } from "../api/users";

const ProfileProperty: React.FC<{
  title: string;
  value: React.ReactNode | string;
}> = ({ title, value }) => {
  return (
    <ListItem className="flex justify-between">
      <span className="text-muted">{title}</span>
      {typeof value === "string" || typeof value === "number" ? (
        <strong>{value}</strong>
      ) : (
        value
      )}
    </ListItem>
  );
};

const ProfilePage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: user,
    isLoading,
    isError,
  } = useFindUserByIdQuery(userId ?? skipToken);

  return (
    <MainLayout title="My Profile" showBackButton showUserPfp={false}>
      <div className="mt-10 p-4">
        <UserPfp className="mx-auto mb-5" size={96} />

        {isLoading && (
          <p className="text-center text-gray-500">Loading profile…</p>
        )}

        {isError && (
          <p className="text-center text-red-500">Failed to load profile</p>
        )}

        {user && (
          <>
            <h2 className="text-center text-2xl font-bold mb-5">
              {user.username}
            </h2>

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
