import clsx from "clsx";

type FannedCardsProps = {
  count: number;
} & React.HTMLAttributes<HTMLDivElement>;

const FannedCards: React.FC<FannedCardsProps> = ({
  count,
  className,
  ...props
}) => {
  const maxSpreadDeg = 30;
  const spread = maxSpreadDeg;
  const start = -spread / 2;

  return (
    <div className={clsx("relative h-16 w-28", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const angle = start + t * spread;
        const offset = (t - 0.5) * 18;

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-8 h-12 rounded bg-primary shadow border-2"
            style={{
              transform: `
                translate(-50%, -50%)
                translateX(${offset}px)
                rotate(${angle}deg)
              `,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
};

export default FannedCards;
