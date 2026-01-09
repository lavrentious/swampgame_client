import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import { FaClock, FaLock, FaUnlock, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router";
import { setUserState } from "src/modules/app/store/appSlice";
import { useAppDispatch, useAppSelector } from "src/store";
import { Badge } from "src/ui/components/Badge";
import { useGetCachedLobbyQuery, useJoinLobbyMutation } from "../api/lobbies";
import { Lobby, LobbyState } from "../api/types";

const lobbyStateConfig: Record<
  LobbyState,
  { label: string; colorClass: string }
> = {
  LS_WAITING_FOR_PLAYERS: {
    label: "Waiting",
    colorClass: "bg-[var(--color-status-waiting)] text-white",
  },
  LS_COUNTDOWN_BEFORE_START: {
    label: "Starting Soon",
    colorClass: "bg-yellow-400 text-black",
  },
  LS_CHOOSING_CARD: {
    label: "Choosing Card",
    colorClass: "bg-blue-500 text-white",
  },
  LS_TRANSFERING_CARD: {
    label: "Transferring",
    colorClass: "bg-purple-500 text-white",
  },
  LS_FIRST_FOLD_PROCESSING: {
    label: "Processing Fold",
    colorClass: "bg-orange-500 text-white",
  },
  LS_WAITING_FOR_OTHERS_TO_FOLD: {
    label: "Waiting to Fold",
    colorClass: "bg-cyan-500 text-black",
  },
  LS_OTHERS_FOLD_PROCESSING: {
    label: "Folding...",
    colorClass: "bg-indigo-500 text-white",
  },
  LS_SHOWING_RESULT: {
    label: "Showing Result",
    colorClass: "bg-green-500 text-white",
  },
};

const getLobbyStateDisplay = (state: LobbyState) => {
  return (
    lobbyStateConfig[state] || {
      label: "Unknown",
      colorClass: "bg-gray-500 text-white",
    }
  );
};

type LobbyListItemProps = {
  lobby: Lobby;
  className?: string;
  showOfflineLobbies?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const LobbyListItem: React.FC<LobbyListItemProps> = ({
  lobby,
  className,
  showOfflineLobbies = true,
  ...props
}) => {
  const [joinLobby] = useJoinLobbyMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.user?.userId);

  const { data: cachedLobby, isLoading } = useGetCachedLobbyQuery(lobby.id);

  const showDynamicContent = !!cachedLobby;

  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        className,
        {
          hidden: !showOfflineLobbies && !cachedLobby,
        },
      )}
      {...props}
      onClick={() => {
        if (
          !lobby.isPrivate &&
          cachedLobby?.lobbyState === "LS_WAITING_FOR_PLAYERS"
        ) {
          // TODO: password handling
          joinLobby({ lobbyId: lobby.id, userId: userId! })
            .unwrap()
            .then(() => {
              dispatch(setUserState({ status: "in_lobby", lobbyId: lobby.id }));
              toast.success(`joined lobby ${lobby.id}`);
              navigate(`/lobby/${lobby.id}`);
            });
        }
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg truncate">{lobby.name}</span>

        {isLoading ? (
          <Badge colorClass="bg-gray-500 text-white" rounded>
            Loading...
          </Badge>
        ) : showDynamicContent ? (
          (() => {
            const config = getLobbyStateDisplay(cachedLobby.lobbyState);
            return (
              <Badge colorClass={config.colorClass} rounded>
                {config.label}
              </Badge>
            );
          })()
        ) : (
          <Badge colorClass="bg-gray-600 text-white" rounded>
            Offline
          </Badge>
        )}
      </div>

      <div className="flex justify-between text-sm text-gray-200">
        {isLoading || !showDynamicContent ? (
          <span className="flex items-center gap-1">
            <FaUsers /> — / {lobby.capacity}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <FaUsers /> {cachedLobby.players.length}/{cachedLobby.capacity}
          </span>
        )}

        <span className="flex items-center gap-1">
          <FaClock /> {lobby.moveTimeout} sec
        </span>

        <span className="flex items-center gap-1">
          {lobby.isPrivate ? <FaLock /> : <FaUnlock />}
          {lobby.isPrivate ? "Private" : "Public"}
        </span>
      </div>
    </div>
  );
};

export default LobbyListItem;
