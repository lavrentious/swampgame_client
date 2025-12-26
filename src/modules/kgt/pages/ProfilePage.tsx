import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Header from "src/modules/common/components/Header";
import UserPfp from "src/modules/common/components/UserPfp";
import { RootState } from "src/store";

import List from "src/ui/components/List";
import ListItem from "src/ui/components/ListItem";
import PageLayout from "src/ui/components/PageLayout";
import { useFindUserByIdQuery } from "../api/users";

const ProfileProperty: React.FC<{
  title: string;
  value: React.ReactNode | string;
}> = ({ title, value }) => {
  return (
    <ListItem className="flex justify-between">
      <span>{title}</span>
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
    <PageLayout>
      <PageLayout.Header>
        <Header title="My Profile" showUserPfp={false} />
      </PageLayout.Header>

      <PageLayout.Body>
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
        </div>

        <Link to="/test">test</Link>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ProfilePage;
