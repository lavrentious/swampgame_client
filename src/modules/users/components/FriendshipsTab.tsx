import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo } from "react";
import { useAppSelector } from "src/store";
import { Spinner } from "src/ui/components/Spinner";
import { useGetAllFriendshipsQuery } from "../api/users";
import FriendshipListEntry from "./FriendshipListEntry";

const FriendshipsTab = () => {
  const user = useAppSelector((state) => state.auth.user);

  const { data: friends, isLoading } = useGetAllFriendshipsQuery(
    user?.userId || skipToken,
    { pollingInterval: 5000 },
  );

  const friendRequests = useMemo(
    () => friends?.filter((f) => f.status !== "ACCEPTED"),
    [friends],
  );

  if (isLoading) return <Spinner />;

  if (!friendRequests || friendRequests.length === 0) {
    return <p className="text-center text-muted">No friend requests yet</p>;
  }

  return (
    <div className="px-4">
      {friendRequests.map((friend) => (
        <FriendshipListEntry
          key={`${friend.requesterUserId}-${friend.addresseeUserId}`}
          friendship={friend}
          currentUserId={user!.userId}
        />
      ))}
    </div>
  );
};

export default FriendshipsTab;
