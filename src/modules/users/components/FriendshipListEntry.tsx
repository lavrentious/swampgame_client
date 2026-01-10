import clsx from "clsx";
import { Badge } from "src/ui/components/Badge";
import LoadingButton from "src/ui/components/LoadingButton";
import { Friendship } from "../api/types";
import {
  useAcceptFriendshipMutation,
  useDeleteFriendshipMutation,
  useFindUserByIdQuery,
} from "../api/users";

type Props = {
  friendship: Friendship;
  currentUserId: number;
  className?: string;
};

const FriendshipListEntry = ({
  friendship,
  currentUserId,
  className,
}: Props) => {
  const [acceptFriendship, { isLoading: isAccepting }] =
    useAcceptFriendshipMutation();
  const [deleteFriendship, { isLoading: isDeleting }] =
    useDeleteFriendshipMutation();

  const isRequester = friendship.requesterUserId === currentUserId;
  const isAddressee = friendship.addresseeUserId === currentUserId;

  const otherUserId = isRequester
    ? friendship.addresseeUserId
    : friendship.requesterUserId;

  const { data: user } = useFindUserByIdQuery(otherUserId);

  const handleAccept = () => {
    acceptFriendship({
      requesterUserId: friendship.requesterUserId,
      addresseeUserId: friendship.addresseeUserId,
    });
  };

  const handleDelete = () => {
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
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg truncate">
          {user ? user.username : `User #${otherUserId}`}
        </span>

        {friendship.status === "PENDING" && (
          <Badge
            rounded
            colorClass={
              isAddressee
                ? "bg-yellow-500 text-black"
                : "bg-blue-500 text-white"
            }
          >
            {isAddressee ? "Incoming request" : "Outgoing request"}
          </Badge>
        )}

        {friendship.status === "ACCEPTED" && (
          <Badge rounded colorClass="bg-green-500 text-white">
            Friends
          </Badge>
        )}

        {friendship.status === "DECLINED" && (
          <Badge rounded colorClass="bg-gray-500 text-white">
            Declined
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {/* Incoming request */}
        {friendship.status === "PENDING" && isAddressee && (
          <>
            <LoadingButton
              size="sm"
              variant="primary"
              isLoading={isAccepting}
              onClick={handleAccept}
            >
              Accept
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="secondary"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Deny
            </LoadingButton>
          </>
        )}

        {/* Outgoing request */}
        {friendship.status === "PENDING" && isRequester && (
          <LoadingButton
            size="sm"
            variant="secondary"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Cancel
          </LoadingButton>
        )}

        {/* Accepted / declined */}
        {friendship.status !== "PENDING" && (
          <LoadingButton
            size="sm"
            variant="secondary"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Remove
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

export default FriendshipListEntry;
