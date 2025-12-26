import clsx from "clsx";
import { Player } from "src/modules/lobbies/api/types";
import FannedCards from "./FannedCards";

const PlayerSeat: React.FC<{ player: Player; active?: boolean }> = ({
  player,
  active,
}) => {
  return (
    <div className="flex flex-col items-center">
      <FannedCards count={4} />
      <span
        className={clsx(
          "text-sm text-white/80 whitespace-nowrap overflow-hidden text-ellipsis max-w-30",
          active && "text-white",
        )}
      >
        {player.firstName}
      </span>
    </div>
  );
};

export default PlayerSeat;
