import clsx from "clsx";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router";
import LoadingButton from "src/ui/components/LoadingButton";
import { Friendship } from "../api/types";
import {
  useDeleteFriendshipMutation,
  useFindUserByIdQuery,
} from "../api/users";
import UserPfp from "./UserPfp";

type Props = {
  friendship: Friendship;
  currentUserId: number;
  className?: string;
};

const FriendListEntry = ({ friendship, currentUserId, className }: Props) => {
  const navigate = useNavigate();

  const [deleteFriendship, { isLoading }] = useDeleteFriendshipMutation();

  const otherUserId =
    friendship.requesterUserId === currentUserId
      ? friendship.addresseeUserId
      : friendship.requesterUserId;

  const { data: user } = useFindUserByIdQuery(otherUserId);

  const handleRemove: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    deleteFriendship({
      requesterUserId: friendship.requesterUserId,
      addresseeUserId: friendship.addresseeUserId,
    });
  };

  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow clickable",
        className,
      )}
      onClick={() => user && navigate(`/profile/${user.id}`)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserPfp
            photoUrl={user?.photoUrl || undefined}
            label={user?.username}
            className="mr-2"
          />
          <span className="font-bold text-lg truncate">
            {user ? user.username : `User #${otherUserId}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LoadingButton
            size="sm"
            variant="secondary"
            isLoading={isLoading}
            onClick={handleRemove}
          >
            Remove
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default FriendListEntry;
