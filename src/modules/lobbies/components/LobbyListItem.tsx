import clsx from "clsx";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaClock, FaLock, FaUnlock, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router";
import { setUserState } from "src/modules/app/store/appSlice";
import { formatApiError } from "src/modules/common/api/utils";
import { useAppDispatch, useAppSelector } from "src/store";
import { Badge } from "src/ui/components/Badge";
import { Button } from "src/ui/components/Button";
import { Input } from "src/ui/components/form/Input";
import { useJoinLobbyMutation } from "../api/lobbies";
import { CachedLobby, Lobby, LobbyState } from "../api/types";

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
  cachedLobby: CachedLobby;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const LobbyListItem: React.FC<LobbyListItemProps> = ({
  lobby,
  cachedLobby,
  className,
  ...props
}) => {
  const [joinLobby] = useJoinLobbyMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleJoin = async () => {
    try {
      await joinLobby({
        lobbyId: lobby.id,
        userId: userId!,
        ...(lobby.isPrivate ? { password } : {}),
      }).unwrap();

      dispatch(setUserState({ status: "in_lobby", lobbyId: lobby.id }));
      toast.success(`Joined lobby ${lobby.id}`);
      navigate(`/lobby/${lobby.id}`);
    } catch (err: unknown) {
      toast.error(formatApiError(err!) || "Failed to join lobby");
    } finally {
      setPasswordModalOpen(false);
      setPassword("");
    }
  };

  return (
    <>
      <div
        className={clsx(
          "bg-surface-alt rounded-2xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
          className,
        )}
        {...props}
        onClick={() => {
          if (cachedLobby?.lobbyState !== "LS_WAITING_FOR_PLAYERS") return;

          if (!lobby.isPrivate) {
            handleJoin();
          } else {
            setPasswordModalOpen(true);
          }
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg truncate">
            {lobby.name} <span className="text-muted">#{lobby.id}</span>
          </span>

          <Badge
            colorClass={getLobbyStateDisplay(cachedLobby.lobbyState).colorClass}
            rounded
          >
            {getLobbyStateDisplay(cachedLobby.lobbyState).label}
          </Badge>
        </div>

        <div className="flex justify-between text-sm text-gray-200">
          <span className="flex items-center gap-1">
            <FaUsers /> {cachedLobby.players.length}/{cachedLobby.capacity}
          </span>

          <span className="flex items-center gap-1">
            <FaClock /> {lobby.moveTimeout} sec
          </span>

          <span className="flex items-center gap-1">
            {lobby.isPrivate ? <FaLock /> : <FaUnlock />}
            {lobby.isPrivate ? "Private" : "Public"}
          </span>
        </div>
      </div>

      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-alt p-6 rounded-xl w-80 flex flex-col gap-4">
            <h3 className="text-lg">
              Enter password for lobby{" "}
              <span className="font-bold">{lobby.name}</span>
            </h3>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setPasswordModalOpen(false);
                  setPassword("");
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleJoin}>
                Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LobbyListItem;
