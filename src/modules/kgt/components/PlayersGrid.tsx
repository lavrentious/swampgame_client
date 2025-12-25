import { Player } from "../api/types";
import PlayerPfp from "./PlayerPfp";

type PlayersGridProps = {
  players: Player[];
};

const PlayersGrid: React.FC<PlayersGridProps> = ({ players }) => {
  return (
    <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center">
      {players.map((p) => (
        <PlayerPfp
          key={p.id}
          name={p.firstName}
          imageUrl={p.imageUrl}
          isHost={p.isHost}
          isWaiting={p.isWaiting}
        />
      ))}
    </div>
  );
};

export default PlayersGrid;
