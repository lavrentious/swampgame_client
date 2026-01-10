import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "src/store";
import { Spinner } from "src/ui/components/Spinner";
import { useGetAllFriendsQuery } from "../api/users";
import FriendListEntry from "./FriendListEntry";

const FriendsTab = () => {
  const user = useAppSelector((state) => state.auth.user);

  const { data: friends, isLoading } = useGetAllFriendsQuery(
    user?.userId || skipToken,
    { pollingInterval: 5000 },
  );

  if (isLoading) return <Spinner />;

  if (!friends || friends.length === 0) {
    return <p className="text-center text-muted">No friends yet</p>;
  }

  return (
    <div className="px-4">
      {friends.map((friend) => (
        <FriendListEntry
          key={`${friend.requesterUserId}-${friend.addresseeUserId}`}
          friendship={friend}
          currentUserId={user!.userId}
        />
      ))}
    </div>
  );
};

export default FriendsTab;
