import clsx from "clsx";

type PlayerAvatarProps = {
  name?: string;
  imageUrl?: string;
  isHost?: boolean;
  isWaiting?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const PlayerPfp: React.FC<PlayerAvatarProps> = ({
  name,
  imageUrl,
  isHost,
  isWaiting,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx("flex flex-col items-center gap-2", className)}
      {...props}
    >
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
          <span className="text-white/40">Waiting...</span>
        ) : (
          <>
            <div className="text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-20">
              {name}
            </div>
            {isHost && <div className="text-sm text-primary">host</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerPfp;
