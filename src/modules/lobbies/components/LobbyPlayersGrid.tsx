import PlayerPfp from "./PlayerPfp";

type PlayersGridProps = {
  players: {
    userId: number;
    displayName: string;
  }[];
  hostUserId?: number;
};

const PlayersGrid: React.FC<PlayersGridProps> = ({ players, hostUserId }) => {
  return (
    <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center">
      {players.map((p) => (
        <PlayerPfp
          key={p.userId}
          name={p.displayName}
          isHost={p.userId === hostUserId}
        />
      ))}
    </div>
  );
};

export default PlayersGrid;
