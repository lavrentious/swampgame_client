import clsx from "clsx";

type PlayerAvatarProps = {
  name?: string;
  imageUrl?: string;
  isHost?: boolean;
  isWaiting?: boolean;
};

const PlayerPfp: React.FC<PlayerAvatarProps> = ({
  name,
  imageUrl,
  isHost,
  isWaiting,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={clsx(
          "w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold",
          isWaiting ? "bg-white/10" : "bg-primary",
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : null}
      </div>

      <div className="text-center">
        {isWaiting ? (
          <span className="text-white/40">waiting ..</span>
        ) : (
          <>
            <div className="text-white">{name}</div>
            {isHost && <div className="text-sm text-primary">host</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerPfp;
