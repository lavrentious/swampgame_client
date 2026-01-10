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
import Modal from "src/ui/components/Modal";
import { useJoinLobbyMutation } from "../api/lobbies";
import { CachedLobby, Lobby, LobbyState } from "../api/types";

const getLobbyStateDisplay = (state: LobbyState) => {
  let stateCategory: string;
  switch (state) {
    case "LS_WAITING_FOR_PLAYERS":
      stateCategory = "Waiting";
      break;
    case "LS_GAME_IN_PROGRESS":
    case "LS_FIRST_FOLD_PROCESSED":
    case "LS_WAITING_FOR_OTHER_FOLDS":
    case "LS_SHOWING_RESULTS":
      stateCategory = "Playing";
      break;
    case "LS_GAME_ENDED":
      stateCategory = "Finished";
      break;
    default:
      stateCategory = "Unknown";
  }

  const categoryConfig: Record<string, { label: string; colorClass: string }> =
    {
      Waiting: {
        label: "Waiting",
        colorClass: "bg-[var(--color-status-waiting)] text-white",
      },
      Playing: {
        label: "Playing",
        colorClass: "bg-blue-500 text-white",
      },
      Finished: {
        label: "Finished",
        colorClass: "bg-green-500 text-white",
      },
      Unknown: {
        label: "Unknown",
        colorClass: "bg-gray-500 text-white",
      },
    };

  return categoryConfig[stateCategory] || categoryConfig["Unknown"];
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

      <Modal
        open={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPassword("");
        }}
      >
        <Modal.Header>
          Enter password for lobby{" "}
          <span className="font-bold">{lobby.name}</span>
        </Modal.Header>

        <Modal.Body>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
        </Modal.Body>

        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LobbyListItem;
