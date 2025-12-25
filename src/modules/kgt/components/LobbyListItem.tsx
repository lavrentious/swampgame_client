import clsx from "clsx";
import React from "react";
import { FaClock, FaLock, FaUnlock, FaUsers } from "react-icons/fa";
import { Badge } from "src/ui/components/Badge";
import { Room, RoomStatus } from "../api/types";

type LobbyListItemProps = {
  room: Room;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const statusColors: Record<RoomStatus, string> = {
  WAITING: "bg-[var(--color-status-waiting)] text-white",
  STARTING: "bg-yellow-400 text-black",
  IN_PROGRESS: "bg-[var(--color-status-playing)] text-white",
  PAUSED: "bg-gray-400 text-white",
  FINISHED: "bg-gray-600 text-white",
  CANCELLED: "bg-red-500 text-white",
};

const LobbyListItem: React.FC<LobbyListItemProps> = ({
  room,
  className,
  ...props
}) => {
  const statusClass = statusColors[room.status];

  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl p-4 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">{room.roomName}</span>
        <Badge colorClass={statusClass} rounded>
          {room.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex justify-between text-sm text-gray-200">
        <span className="flex items-center gap-1">
          <FaUsers /> {room.currentPlayers}/{room.maxPlayers}
        </span>
        <span className="flex items-center gap-1">
          <FaClock /> 10 min
        </span>
        <span className="flex items-center gap-1">
          {room.hasPassword ? <FaLock /> : <FaUnlock />}{" "}
          {room.hasPassword ? "Private" : "Public"}
        </span>
      </div>
    </div>
  );
};

export default LobbyListItem;
