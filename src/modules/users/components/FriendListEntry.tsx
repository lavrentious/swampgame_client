import clsx from "clsx";
import { useNavigate } from "react-router";
import LoadingButton from "src/ui/components/LoadingButton";
import { Friendship } from "../api/types";
import {
  useDeleteFriendshipMutation,
  useFindUserByIdQuery,
} from "../api/users";

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

  const handleRemove = () => {
    deleteFriendship({
      requesterUserId: friendship.requesterUserId,
      addresseeUserId: friendship.addresseeUserId,
    });
  };

  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
      onClick={() => user && navigate(`/profile/${user.id}`)}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg truncate">
          {user ? user.username : `User #${otherUserId}`}
        </span>

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
