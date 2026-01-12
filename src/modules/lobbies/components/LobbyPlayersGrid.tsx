import { useNavigate } from "react-router";
import PlayerPfp from "./PlayerPfp";

type PlayersGridProps = {
  players: {
    userId: number;
    displayName: string;
  }[];
  hostUserId?: number;
};

const PlayersGrid: React.FC<PlayersGridProps> = ({ players, hostUserId }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center">
      {players.map((p) => (
        <PlayerPfp
          key={p.userId}
          userId={p.userId}
          name={p.displayName}
          isHost={p.userId === hostUserId}
          onClick={() => navigate(`/profile/${p.userId}`)}
        />
      ))}
    </div>
  );
};

export default PlayersGrid;
