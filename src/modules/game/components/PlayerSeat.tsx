import clsx from "clsx";
import { Player } from "src/modules/lobbies/api/types";
import FannedCards from "./FannedCards";

type Props = {
  player: Player;
  active?: boolean;
  foldVector?: { x: number; y: number };
  foldRotation?: number;
};

const PlayerSeat: React.FC<Props> = ({
  player,
  active,
  foldVector,
  foldRotation,
}) => {
  const folded = player.foldOrderNumber != null;

  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx("transition-opacity", folded && "animate-fold")}
        style={
          folded && foldVector
            ? {
                ["--fold-x" as string]: `${foldVector.x}px`,
                ["--fold-y" as string]: `${foldVector.y}px`,
                ["--fold-rotation" as string]: `${foldRotation}deg`,
              }
            : undefined
        }
      >
        <FannedCards count={4} />
      </div>

      <span
        className={clsx(
          "text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-30",
          folded ? "text-white/40 line-through" : "text-white/80",
          active && "text-white",
        )}
      >
        {player.displayName}
      </span>
    </div>
  );
};

export default PlayerSeat;
