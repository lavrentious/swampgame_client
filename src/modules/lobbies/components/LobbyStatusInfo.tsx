import clsx from "clsx";

type LobbyStatusInfoProps = {
  current: number;
  max: number;
  isHost?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const LobbyStatusInfo: React.FC<LobbyStatusInfoProps> = ({
  current,
  max,
  isHost,
  className,
  ...props
}) => {
  return (
    <div className={clsx("text-center space-y-3", className)} {...props}>
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
