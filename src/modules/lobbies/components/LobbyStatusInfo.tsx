type LobbyStatusInfoProps = {
  current: number;
  max: number;
  isHost: boolean;
};

const LobbyStatusInfo: React.FC<LobbyStatusInfoProps> = ({
  current,
  max,
  isHost,
}) => {
  return (
    <div className="text-center space-y-3">
      <div className="text-2xl font-semibold">
        {current}/{max}
      </div>

      {isHost && (
        <div className="text-white/70">
          You are the host
          <br />
          You can run the game
        </div>
      )}
    </div>
  );
};

export default LobbyStatusInfo;
